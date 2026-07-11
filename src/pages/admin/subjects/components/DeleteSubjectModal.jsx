import { AlertTriangle, X } from "lucide-react";

const DeleteSubjectModal = ({ error, loading, onClose, onDelete, subject }) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[var(--error)]">
            <AlertTriangle size={22} />
          </span>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:bg-[var(--surface-soft)]">
            <X size={17} />
          </button>
        </div>

        <h2 className="mt-4 text-lg font-bold text-[var(--university-ink)]">Deactivate Subject</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[var(--university-muted)]">
          This will mark <span className="font-bold text-[var(--university-ink)]">{subject.name}</span> as inactive.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[var(--border)] bg-white text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
            Cancel
          </button>
          <button type="button" onClick={onDelete} disabled={loading} className="h-10 rounded-lg bg-[var(--error)] text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DeleteSubjectModal;
