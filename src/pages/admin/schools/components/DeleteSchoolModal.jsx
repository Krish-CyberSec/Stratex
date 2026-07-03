import { AlertTriangle, Trash2, X } from "lucide-react";

const DeleteSchoolModal = ({ school, loading, error, onClose, onDelete }) => {
  if (!school) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-red-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[var(--error)]">
              <AlertTriangle size={19} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--university-ink)]">
                Delete school
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--university-muted)]">
                This will mark the school as inactive in the backend.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--university-muted)] transition hover:bg-red-50"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm text-[var(--university-muted)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--university-ink)]">
              {school.name}
            </span>
            ?
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-[var(--error)]">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-red-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--university-border)] px-4 py-2.5 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--error)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {loading ? "Deleting..." : "Delete School"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSchoolModal;
