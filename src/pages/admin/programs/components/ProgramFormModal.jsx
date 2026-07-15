import { Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const initialForm = {
  name: "",
  code: "",
  codeMode: "auto",
  schoolId: "",
  degreeType: "UG",
  duration: 4,
  status: "active",
  description: "",
};

const ProgramFormModal = ({ error, loading, onClose, onSubmit, program, schools }) => {
  const [form, setForm] = useState(initialForm);
  const isEdit = Boolean(program);

  useEffect(() => {
    setForm({
      name: program?.name || "",
      code: program?.code || "",
      codeMode: program?.code ? "manual" : "auto",
      schoolId: program?.schoolId?._id || program?.schoolId || schools[0]?._id || "",
      degreeType: program?.degreeType || "UG",
      duration: program?.duration || 4,
      status: program?.status || "active",
      description: program?.description || "",
    });
  }, [program, schools]);

  const canSubmit = useMemo(
    () => form.name.trim().length >= 2 && form.schoolId && Number(form.duration) >= 1 && !loading,
    [form.duration, form.name, form.schoolId, loading],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      name: form.name.trim(),
      code: form.codeMode === "manual" ? form.code.trim() : "",
      schoolId: form.schoolId,
      degreeType: form.degreeType,
      duration: Number(form.duration),
      status: form.status,
      description: form.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-sm">
      <section className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--university-ink)]">
              {isEdit ? "Edit Program" : "Add New Program"}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
              {isEdit ? "Update program details and duration." : "Create a program and auto-generate semesters."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:bg-[var(--surface-soft)]">
            <X size={17} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Program Name *</span>
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)]" placeholder="B.Tech Computer Science Engineering" />
            </label>

            <label className="block">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[var(--university-ink)]">Program Code</span>
                <span className="grid grid-cols-2 rounded-lg border border-[var(--border)] bg-white p-1 text-xs font-bold">
                  {["auto", "manual"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateField("codeMode", mode)}
                      className={`rounded-md px-3 py-1.5 capitalize transition ${
                        form.codeMode === mode
                          ? "bg-[var(--stratex-blue)] text-white shadow-sm"
                          : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </span>
              </div>
              <input disabled={form.codeMode === "auto"} value={form.code} onChange={(event) => updateField("code", event.target.value.toUpperCase())} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]" placeholder={form.codeMode === "auto" ? "Auto-generated after save" : "e.g. CSE-UG"} />
              <span className="mt-1.5 block text-xs font-medium text-[var(--university-muted)]">
                {form.codeMode === "auto" ? "Backend will generate a unique school-scoped code." : "Manual codes are normalized and checked for duplicates."}
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">School *</span>
              <select value={form.schoolId} onChange={(event) => updateField("schoolId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="">Select school</option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>{school.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Degree Type *</span>
              <select value={form.degreeType} onChange={(event) => updateField("degreeType", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="Diploma">Diploma</option>
                <option value="PhD">PhD</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Duration (Years) *</span>
              <input type="number" min="1" value={form.duration} onChange={(event) => updateField("duration", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)]" />
              <span className="mt-1.5 block text-xs font-medium text-[var(--university-muted)]">
                Semesters generated: {Number(form.duration || 0) * 2}
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Status</span>
              <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Description</span>
              <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} className="min-h-28 w-full resize-y rounded-lg border border-[var(--border)] px-3 py-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)]" placeholder="Add a short description of the program" />
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={16} />
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Program"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProgramFormModal;
