import { Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const EditSubjectModal = ({ error, loading, onClose, onSubmit, subject }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    credits: 0,
    status: "active",
  });

  useEffect(() => {
    setForm({
      name: subject?.name || "",
      description: subject?.description || "",
      credits: subject?.credits ?? 0,
      status: subject?.status || "active",
    });
  }, [subject]);

  const canSubmit = useMemo(
    () => form.name.trim().length >= 2 && Number(form.credits) >= 0 && !loading,
    [form.credits, form.name, loading],
  );

  if (!subject) return null;

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      credits: Number(form.credits),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-sm">
      <section className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--university-ink)]">Edit Subject</h2>
            <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">{subject.code}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:bg-[var(--surface-soft)]">
            <X size={17} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Subject Name *</span>
            <input value={form.name} onChange={(event) => update("name", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)]" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Credits</span>
              <input type="number" min="0" value={form.credits} onChange={(event) => update("credits", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Status</span>
              <select value={form.status} onChange={(event) => update("status", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">Description</span>
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} className="min-h-28 w-full resize-y rounded-lg border border-[var(--border)] px-3 py-3 text-sm font-medium outline-none focus:border-[var(--stratex-blue)]" />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditSubjectModal;
