import { X } from "lucide-react";
import SchoolForm from "./SchoolForm";

const EditSchoolModal = ({ school, loading, error, onClose, onSave }) => {
  if (!school) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-3 py-4 sm:px-5">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--university-border)] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--university-muted)]">
              Edit school
            </p>
            <h2 className="mt-1 truncate text-xl font-semibold text-[var(--university-ink)]">
              {school.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-muted)] transition hover:bg-[var(--university-surface-soft)]"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-5 sm:px-6">
          <SchoolForm
            mode="edit"
            school={school}
            loading={loading}
            error={error}
            onCancel={onClose}
            onSubmit={onSave}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSchoolModal;
