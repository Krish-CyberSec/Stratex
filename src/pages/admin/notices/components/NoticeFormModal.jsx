import { FileText, Save, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const audienceOptions = [
  { label: "All", value: "all" },
  { label: "Super Admin", value: "superAdmin" },
  { label: "School Admin", value: "schoolAdmin" },
  { label: "Faculty", value: "faculty" },
  { label: "Coordinator", value: "coordinator" },
  { label: "Students", value: "student" },
  { label: "Exam Cell", value: "examCell" },
];

const getInitialForm = (notice) => ({
  title: notice?.title || "",
  content: notice?.content || "",
  audience: notice?.audience?.length ? notice.audience : ["all"],
  status: notice?.status || "published",
  publishedAt: notice?.publishedAt ? new Date(notice.publishedAt).toISOString().slice(0, 16) : "",
  attachment: null,
});

const NoticeFormModal = ({ error, loading, notice, onClose, onSubmit, open }) => {
  const [form, setForm] = useState(getInitialForm(notice));

  useEffect(() => {
    setForm(getInitialForm(notice));
  }, [notice, open]);

  const canSubmit = useMemo(
    () => form.title.trim().length >= 2 && form.content.trim().length >= 2 && !loading,
    [form.content, form.title, loading],
  );

  if (!open) return null;

  const toggleAudience = (value) => {
    setForm((current) => {
      if (value === "all") return { ...current, audience: ["all"] };

      const withoutAll = current.audience.filter((item) => item !== "all");
      const next = withoutAll.includes(value)
        ? withoutAll.filter((item) => item !== value)
        : [...withoutAll, value];

      return { ...current, audience: next.length ? next : ["all"] };
    });
  };

  const submit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      audience: form.audience,
      status: form.status,
      attachment: form.attachment,
      ...(form.publishedAt ? { publishedAt: new Date(form.publishedAt).toISOString() } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[var(--university-ink)]">{notice ? "Edit Notice" : "Create Notice"}</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">Share important announcements with the selected audience.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:bg-[var(--surface-soft)]">
            <X size={17} />
          </button>
        </header>

        <form onSubmit={submit} className="space-y-5 p-5">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">{error}</div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Notice Title *</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" placeholder="Enter notice title" />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Content *</span>
            <textarea value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="min-h-32 w-full resize-y rounded-lg border border-[var(--border)] px-3 py-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" placeholder="Write notice details..." />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Status</span>
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Published On</span>
              <input type="datetime-local" value={form.publishedAt} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
            </label>
          </div>

          <div>
            <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Supporting File</span>
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-5 text-center transition hover:border-[var(--stratex-blue)] hover:bg-blue-50">
              <UploadCloud size={22} className="text-[var(--stratex-blue)]" />
              <span className="mt-2 text-sm font-black text-[var(--university-ink)]">
                {form.attachment?.name || "Click to upload supporting file"}
              </span>
              <span className="mt-1 text-xs font-semibold text-[var(--university-muted)]">PDF, image, or document up to 10MB.</span>
              <input
                type="file"
                className="hidden"
                onChange={(event) => setForm((current) => ({ ...current, attachment: event.target.files?.[0] || null }))}
              />
            </label>
            {notice?.attachment?.url && !form.attachment ? (
              <a href={notice.attachment.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[var(--stratex-blue)]">
                <FileText size={14} />
                View current supporting file
              </a>
            ) : null}
          </div>

          <div>
            <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Audience</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {audienceOptions.map((option) => (
                <label key={option.value} className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border-light)] px-3 text-xs font-bold text-[var(--university-ink)]">
                  <input type="checkbox" checked={form.audience.includes(option.value)} onChange={() => toggleAudience(option.value)} className="accent-[var(--stratex-blue)]" />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">Cancel</button>
            <button type="submit" disabled={!canSubmit} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={16} />
              {loading ? "Saving..." : "Save Notice"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default NoticeFormModal;
