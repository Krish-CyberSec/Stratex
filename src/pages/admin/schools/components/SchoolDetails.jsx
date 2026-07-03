import { CalendarDays, ExternalLink, X } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const SchoolDetails = ({ school, onClose, onEdit, onDelete }) => {
  if (!school) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-xl">
        <div className="relative min-h-44 bg-[var(--university-blue-dark)]">
          {school.banner ? (
            <img
              src={school.banner}
              alt={`${school.name} banner`}
              className="h-44 w-full object-cover"
            />
          ) : (
            <div className="h-44 w-full bg-[linear-gradient(135deg,var(--university-blue-dark),var(--university-sky))]" />
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--university-ink)] transition hover:bg-white"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[var(--university-surface-soft)] text-2xl font-bold text-[var(--university-blue-dark)] shadow-sm">
                {school.logo ? (
                  <img
                    src={school.logo}
                    alt={`${school.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  school.name?.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="pb-1">
                <span className="inline-flex rounded-full bg-[color-mix(in_srgb,var(--success)_12%,white)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--success)]">
                  {school.status}
                </span>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--university-ink)]">
                  {school.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
                  /{school.slug}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(school)}
                className="rounded-xl border border-[var(--university-border)] px-4 py-2.5 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(school)}
                className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-[var(--error)] transition hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface-soft)] p-4">
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {school.description || "No description added for this school yet."}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--university-border)] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                <CalendarDays size={15} />
                Created
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--university-ink)]">
                {formatDate(school.createdAt)}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--university-border)] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                <ExternalLink size={15} />
                School URL
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-[var(--university-ink)]">
                {school.schoolUrl || `/schools/${school.slug}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails;
