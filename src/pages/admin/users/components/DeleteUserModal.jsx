import { Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const DeleteUserModal = ({ user, onClose, onDelete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    onClose?.();
  }, [isSubmitting, onClose]);

  const handleDelete = async () => {
    if (isSubmitting || !onDelete || !user) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onDelete(user._id);
      handleClose();
    } catch (err) {
      setError(
        err?.message || "Unable to deactivate the user. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setError("");
      setIsSubmitting(false);
      return;
    }

    setError("");
    setIsSubmitting(false);
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [user, isSubmitting, handleClose]);

  useEffect(() => {
    document.body.style.overflow = user ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [user]);

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] overflow-y-auto w-full max-w-md mx-3 sm:mx-0 rounded-2xl sm:rounded-3xl border border-red-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-[var(--error)]">
              <Trash2 size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--stratex-navy)]">
                Deactivate User
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[var(--text-secondary)]">
                This user will no longer have active access
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close delete modal"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-[var(--error)] transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-sm leading-6 text-[var(--university-muted)]">
            Are you sure you want to deactivate{" "}
            <span className="break-words font-semibold text-[var(--university-ink)]">
              {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
            </span>
            ?
          </p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex justify-end gap-3 border-t border-red-100 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-[var(--university-border)] bg-white px-6 py-3 font-semibold text-[var(--stratex-navy)] transition-all md:hover:bg-[var(--background)] md:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--error)] px-6 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(229,57,53,0.25)] transition-all duration-200 md:hover:-translate-y-0.5 md:hover:bg-red-700 md:hover:shadow-[0_12px_30px_rgba(229,57,53,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deactivating...
                </>
              ) : (
                <>
                  <Trash2 size={17} />
                  Deactivate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
