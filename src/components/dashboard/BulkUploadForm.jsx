import { useState, useRef } from "react";

// Lightweight CSV parser handling quoted fields
const normalizePreviewValue = (key, value) => {
  const val = String(value || "").trim();
  const lowerKey = key.toLowerCase();

  if (lowerKey === "code" || lowerKey === "programcode" || lowerKey === "subjectcode") {
    return val.toUpperCase();
  }

  if (lowerKey === "slug" || lowerKey === "schoolslug") {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  if (lowerKey === "status") {
    return (val || "active").toLowerCase();
  }

  if (lowerKey === "degreetype") {
    return val.toUpperCase();
  }

  if (lowerKey === "duration" || lowerKey === "credit" || lowerKey === "credits") {
    return val;
  }

  return val;
};

const formatFieldLabel = (field) =>
  String(field || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const parseCsvText = (text) => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const re = /("([^"]|"")*"|[^,]+)/g;
    const matches = line.match(re) || [];
    return matches.map((cell) => {
      let v = cell.trim();
      if (v.startsWith('"') && v.endsWith('"')) {
        v = v.slice(1, -1).replace(/""/g, '"');
      }
      return v;
    });
  };

  const headers = parseLine(lines[0]).map((h) => String(h || "").trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.toLowerCase()] = values[idx] !== undefined ? values[idx] : "";
    });
    return obj;
  });

  return { headers, rows };
};

const BulkUploadForm = ({
  title,
  subtitle,
  templateFileName,
  templateHeaders,
  sampleRows = [],
  onUpload,
  helpText,
  validationSchema = null, // optional schema for preflight validation
  onDownloadReferences = null, // optional function to produce reference CSV
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [createdCount, setCreatedCount] = useState(null);
  const [preflightErrors, setPreflightErrors] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [expandedPreviewRows, setExpandedPreviewRows] = useState({});
  const [previewAccepted, setPreviewAccepted] = useState(false);
  const [createdRecords, setCreatedRecords] = useState([]);

  const togglePreviewRow = (index) => {
    setExpandedPreviewRows((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };
  const createdRecordsRef = useRef(null);

  const downloadMapping = (records, filename = `created-records-${Date.now()}.csv`) => {
    if (!Array.isArray(records) || !records.length) return;
    const header = ["id", "code", "name", "programId", "semesterId"];
    const rows = [header, ...records.map((r) => [r.id, r.code, r.name, r.programId, r.semesterId])];
    const contents = rows
      .map((row) =>
        row
          .map((field) => {
            const escaped = String(field || "").replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const rows = [templateHeaders, ...sampleRows];
    const contents = rows
      .map((row) =>
        row
          .map((field) => {
            const escaped = String(field || "").replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", templateFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setMessage("");
    setErrors([]);
    setCreatedCount(null);
    setPreflightErrors([]);

    if (file && file.name.toLowerCase().endsWith(".csv") && validationSchema) {
      // run client-side preflight validation and build preview rows
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "");
        const { headers, rows } = parseCsvText(text);
        const lowerHeaders = headers.map((h) => h.toLowerCase());
        const missingHeaders = (validationSchema.requiredHeaders || []).filter((h) => !lowerHeaders.includes(h.toLowerCase()));
        const localErrors = [];
        if (missingHeaders.length) {
          localErrors.push(`Missing required columns: ${missingHeaders.join(", ")}`);
        }

        const preview = rows.slice(0, 20).map((row) => {
          const original = {};
          const normalized = {};

          Object.keys(row).forEach((key) => {
            original[key] = String(row[key] ?? "");
            normalized[key] = normalizePreviewValue(key, row[key]);
          });

          return { original, normalized };
        });

        rows.forEach((row, idx) => {
          const rowNumber = idx + 2;
          // per-field validation rules
          if (validationSchema.fields) {
            Object.keys(validationSchema.fields).forEach((fieldKey) => {
              const rule = validationSchema.fields[fieldKey];
              const raw = (row[fieldKey.toLowerCase()] || "").trim();

              if (rule.required && !raw) {
                localErrors.push(`Row ${rowNumber}: ${fieldKey} is required`);
                return;
              }

              if (raw) {
                if (rule.enum) {
                  const normalized = raw.toString().trim().toLowerCase();
                  const allowed = rule.enum.map((v) => v.toString().toLowerCase());
                  if (!allowed.includes(normalized)) {
                    localErrors.push(`Row ${rowNumber}: ${fieldKey} must be one of [${rule.enum.join(", ")}] (found: ${raw})`);
                    return;
                  }
                }

                if (rule.type === "number") {
                  const n = Number(raw);
                  if (Number.isNaN(n) || (rule.min !== undefined && n < rule.min)) {
                    localErrors.push(`Row ${rowNumber}: ${fieldKey} must be a number${rule.min !== undefined ? ` >= ${rule.min}` : ""}`);
                    return;
                  }
                }

                if (rule.format === "objectId") {
                  // basic check for 24-hex characters
                  if (!/^[a-fA-F0-9]{24}$/.test(raw)) {
                    // Not necessarily fatal: allow slug/code alternative - check rule.allowAlternative
                    if (!rule.allowAlternative) {
                      localErrors.push(`Row ${rowNumber}: ${fieldKey} must be a valid object id`);
                    }
                  }
                }

                if (rule.custom && typeof rule.custom === "function") {
                  const message = rule.custom(raw, row);
                  if (message) localErrors.push(`Row ${rowNumber}: ${message}`);
                }
              }
            });
          }

          // cross-field checks
          if (validationSchema.crossChecks) {
            validationSchema.crossChecks.forEach((check) => {
              const message = check.fn(row);
              if (message) {
                localErrors.push(`Row ${rowNumber}: ${message}`);
              }
            });
          }
        });

        setPreflightErrors(localErrors);
        setPreviewRows(preview);
        setPreviewAccepted(false);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrors([]);
    setCreatedCount(null);

    if (!selectedFile) {
      setErrors(["Please choose a CSV file to upload."]);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrors(["Only .csv files are accepted."]);
      return;
    }

    if (preflightErrors.length) {
      setErrors(["Please fix preflight errors before uploading.", ...preflightErrors]);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      const response = await onUpload(formData);
      setCreatedCount(response.data?.createdCount ?? 0);
      const created = response.data?.created || [];
      setCreatedRecords(created);
      // auto-download mapping and scroll into view
      try {
        downloadMapping(created, `created-records-${Date.now()}.csv`);
        setTimeout(() => {
          if (createdRecordsRef.current) {
            createdRecordsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 250);
      } catch (e) {
        // non-fatal
        console.warn('auto-download mapping failed', e);
      }

      setMessage(response.data?.message || "Upload completed successfully.");
      if (Array.isArray(response.data?.errors) && response.data.errors.length) {
        setErrors(response.data.errors);
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.message || "Upload failed.";
      const apiErrors = err?.response?.data?.errors;
      setMessage(apiMessage);
      setErrors(Array.isArray(apiErrors) ? apiErrors : [apiMessage]);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadReferences = async () => {
    if (!onDownloadReferences) return;
    try {
      const data = await onDownloadReferences();
      // data is expected to be array of rows (arrays)
      const contents = data
        .map((row) =>
          row
            .map((field) => {
              const escaped = String(field || "").replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(",")
        )
        .join("\r\n");

      const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `references-${subtitle.replace(/\s+/g, "-").toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err?.message || "Unable to download references");
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border-light)] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--university-muted)]">
            {subtitle}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{title}</h1>
        </div>
        <div className="flex gap-3">
          {onDownloadReferences ? (
            <button
              type="button"
              onClick={handleDownloadReferences}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-hover)]"
            >
              Download references
            </button>
          ) : null}

          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-hover)]"
          >
            Download template
          </button>
        </div>
      </div>

      <p className="mb-8 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
        {helpText}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-4 shadow-sm">
            <span className="block text-sm font-semibold text-[var(--university-ink)]">Upload CSV file</span>
            <span className="mt-2 block text-xs text-[var(--university-muted)]">
              Choose a file containing rows for bulk import.
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="mt-4 w-full rounded-xl border border-dashed border-[var(--border)] bg-white px-3 py-3 text-sm text-[var(--text-primary)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--stratex-blue)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={uploading || !previewAccepted}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--stratex-blue)] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload CSV"}
            </button>
          </div>
        </div>

        {message ? (
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--surface-soft)] px-4 py-4 text-sm text-[var(--university-ink)]">
            {message}
          </div>
        ) : null}

        {preflightErrors.length ? (
          <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-[var(--university-ink)]">
            <h2 className="font-semibold">Preflight validation issues</h2>
            <ul className="list-disc space-y-1 pl-5">
              {preflightErrors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
            <p className="text-xs text-[var(--university-muted)]">Fix these issues in your CSV before uploading to avoid row-level failures.</p>
          </div>
        ) : null}

        {previewRows.length ? (
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--university-ink)]">Preview (first {previewRows.length} rows)</h3>
                <p className="mt-1 text-sm text-[var(--university-muted)]">
                  Review the normalized values and expanded details before uploading. Each row can be expanded to compare field-level changes.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewAccepted(true)}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${previewAccepted ? 'bg-[var(--success)] text-white shadow-sm' : 'bg-[var(--surface-soft)] text-[var(--university-ink)] hover:bg-[var(--surface-hover)]'}`}>
                  {previewAccepted ? 'Preview accepted' : 'Accept preview'}
                </button>
                <button
                  type="button"
                  onClick={() => { setPreviewRows([]); setSelectedFile(null); setExpandedPreviewRows({}); }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {previewRows.map((row, idx) => {
                const original = row.original || {};
                const normalized = row.normalized || {};
                const fields = Array.from(new Set([...Object.keys(original), ...Object.keys(normalized)]));
                const changedCount = fields.filter((field) => String((original[field] || "")).trim() !== String((normalized[field] || "")).trim()).length;
                const expanded = Boolean(expandedPreviewRows[idx]);

                return (
                  <div key={`preview-${idx}`} className="rounded-3xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--university-ink)]">Row {idx + 1}</p>
                        <p className="mt-1 text-xs text-[var(--university-muted)]">
                          {changedCount > 0
                            ? `${changedCount} field${changedCount === 1 ? '' : 's'} normalized`
                            : 'No normalized changes required'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => togglePreviewRow(idx)}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-semibold text-[var(--university-ink)] transition hover:border-[var(--university-blue)] hover:text-[var(--university-blue)]"
                        >
                          {expanded ? 'Hide details' : 'Show details'}
                        </button>
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 grid gap-4 lg:grid-cols-[repeat(2,minmax(0,1fr))]">
                        <div className="rounded-3xl border border-[var(--border-light)] bg-white p-4">
                          <h4 className="text-sm font-semibold text-[var(--university-ink)]">Original values</h4>
                          <div className="mt-3 space-y-2 text-sm text-[var(--university-ink)]">
                            {fields.map((field) => (
                              <div key={`original-${field}`} className="flex flex-col gap-1 rounded-2xl bg-[var(--surface-soft)] p-3">
                                      <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--university-muted)]">{formatFieldLabel(field)}</span>
                                <span className="break-words font-medium">{original[field] || '—'}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-3xl border border-[var(--border-light)] bg-white p-4">
                          <h4 className="text-sm font-semibold text-[var(--university-ink)]">Normalized values</h4>
                          <div className="mt-3 space-y-2 text-sm text-[var(--university-ink)]">
                            {fields.map((field) => {
                              const originalValue = String(original[field] || "").trim();
                              const normalizedValue = String(normalized[field] || "").trim();
                              const changed = originalValue !== normalizedValue;
                              return (
                                <div
                                  key={`normalized-${field}`}
                                  className={`flex flex-col gap-1 rounded-2xl p-3 ${changed ? 'bg-[rgba(46,125,255,0.08)] border border-[var(--stratex-blue)]' : 'bg-[var(--surface-soft)]'}`}
                                >
                                        <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--university-muted)]">{formatFieldLabel(field)}</span>
                                  <span className="break-words font-medium">{normalizedValue || '—'}</span>
                                  {changed ? (
                                    <span className="text-xs text-[var(--stratex-blue)]">Normalized from original</span>
                                        ) : (
                                          <span className="text-xs text-[var(--university-muted)]">Unchanged</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {!previewAccepted ? (
              <p className="mt-3 text-xs text-[var(--university-muted)]">Review the row details above and click "Accept preview" to enable upload.</p>
            ) : (
              <p className="mt-3 text-xs text-[var(--success)]">Preview accepted — you can now upload the CSV.</p>
            )}
          </div>
        ) : null}

        {createdCount !== null ? (
          <div className="rounded-2xl border border-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,white)] px-4 py-4 text-sm font-semibold text-[var(--success)]">
            Created {createdCount} record{createdCount === 1 ? "" : "s"} successfully.
          </div>
        ) : null}

        {createdRecords && createdRecords.length ? (
          <div ref={createdRecordsRef} className="rounded-2xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--university-ink)]">Created records</h3>
              <button
                type="button"
                onClick={() => downloadMapping(createdRecords)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)] px-3 text-sm font-bold text-[var(--university-ink)]"
              >
                Download mapping
              </button>
            </div>

            <div className="mt-3 max-h-48 overflow-auto text-sm">
              <table className="min-w-full table-auto text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="px-2 py-1 font-semibold">#</th>
                    <th className="px-2 py-1 font-semibold">ID</th>
                    <th className="px-2 py-1 font-semibold">Code</th>
                    <th className="px-2 py-1 font-semibold">Name</th>
                    <th className="px-2 py-1 font-semibold">Program</th>
                    <th className="px-2 py-1 font-semibold">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {createdRecords.map((r, idx) => (
                    <tr key={`created-${r.id}`} className="border-t">
                      <td className="px-2 py-2 align-top">{idx + 1}</td>
                      <td className="px-2 py-2 align-top break-all">{r.id}</td>
                      <td className="px-2 py-2 align-top">{r.code}</td>
                      <td className="px-2 py-2 align-top">{r.name}</td>
                      <td className="px-2 py-2 align-top break-all">{r.programId}</td>
                      <td className="px-2 py-2 align-top break-all">{r.semesterId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {errors.length ? (
          <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-[var(--error)]">
            <h2 className="font-semibold">Errors</h2>
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default BulkUploadForm;
