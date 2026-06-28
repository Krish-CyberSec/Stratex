import { Pencil, Trash2, X } from "lucide-react";
const UserDetails = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--university-ink)]">
            User Details
          </h2>
          <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
            Profile and account information
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--university-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Name
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--university-ink)]">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--university-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Email
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--university-ink)]">
            {user.email}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--university-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Role
          </p>
          <p className="mt-2 inline-flex rounded-full bg-[color-mix(in_srgb,var(--university-blue)_9%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--university-blue-dark)]">
            {user.role}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--university-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            School
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--university-ink)]">
            {user.school}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--university-border)] bg-white p-4 md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Status
          </p>
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              user.status === "active"
                ? "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]"
                : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-4 border-t border-[var(--university-border)] px-5 py-5">
        <button
          onClick={() => onEdit(user)}
          className="inline-flex items-center justify-center rounded-2xl border border-[#BFD6F6] bg-white px-8 py-3 text-sm font-semibold text-[#0B5CAD] shadow-sm transition-all duration-200 hover:bg-[#F8FBFF]"
        >
          <Pencil size={16} className="mr-2" />
          Edit
        </button>

        <button
          onClick={() => onDelete(user)}
          className="inline-flex items-center justify-center rounded-2xl bg-[#E53935] px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(229,57,53,0.25)] transition-all duration-200 hover:bg-[#D32F2F]"
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
