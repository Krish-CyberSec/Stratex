import { AlertTriangle, Trash2, X } from "lucide-react";

const DeleteProgramModal = ({ error, loading, onClose, onDelete, program }) => {
  if (!program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-[var(--error)]">
            <AlertTriangle size={21} />
          </span>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:bg-[var(--surface-soft)]">
            <X size={17} />
          </button>
        </div>

        <h2 className="mt-4 text-lg font-bold text-[var(--university-ink)]">Delete Program</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[var(--text-secondary)]">
          This will mark <span className="font-bold text-[var(--university-ink)]">{program.name}</span> as inactive. Backend rules may block deletion if dependent semesters, subjects, users, notifications, or specializations exist.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
            Cancel
          </button>
          <button type="button" onClick={onDelete} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--error)] px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-60">
            <Trash2 size={16} />
            {loading ? "Deleting..." : "Delete Program"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DeleteProgramModal;

