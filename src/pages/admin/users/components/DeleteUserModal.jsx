import { Trash2, X } from "lucide-react";
const DeleteUserModal = ({ error = "", loading = false, user, onClose, onDelete }) => {
  if (!user) return null;

  const handleDelete = () => {
    onDelete(user._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-red-200 bg-[var(--university-surface)] shadow-xl">
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--error)]">
              <Trash2 size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--university-ink)]">
                Delete User
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
                This action cannot be undone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-[var(--error)] transition hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}
          <p className="text-sm leading-6 text-[var(--university-muted)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--university-ink)]">
              {user.firstName} {user.lastName}
            </span>
            ?
          </p>

          <div className="mt-6 flex justify-end gap-3 border-t border-red-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[var(--university-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--error)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={17} />
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
