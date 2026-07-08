import { Activity, Building2, Mail, Pencil, Shield, Trash2, X } from "lucide-react";

const formatRole = (role) => {
  const roleMap = {
    student: "Student",
    faculty: "Faculty",
    schoolAdmin: "School Admin",
    superAdmin: "Super Admin",
    coordinator: "Coordinator",
    examCell: "Exam Cell",
  };

  return roleMap[role] || role;
};

const getInitials = (user) =>
  [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("") || "?";

const DetailItem = ({ icon: Icon, label, children }) => (
  <div className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]">
      <Icon size={14} />
      <span>{label}</span>
    </p>
    <div className="mt-2 text-sm font-semibold text-[var(--university-ink)]">
      {children}
    </div>
  </div>
);

const UserDetails = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  const isActive = user.status?.toLowerCase() === "active";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative border-b border-[var(--border-light)] bg-[var(--surface-soft)] p-5 pr-14 sm:p-6 sm:pr-16">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-lg font-bold text-[var(--stratex-blue)]">
              {getInitials(user)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-[var(--university-ink)]">
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-1 break-all text-sm font-medium text-[var(--university-muted)]">
                {user.email}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--university-muted)]">
                User Details
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-4 bg-white p-4 sm:p-6 md:grid-cols-2">
          <DetailItem icon={Mail} label="Email">
            <p className="break-all">{user.email || "No Email"}</p>
          </DetailItem>

          <DetailItem icon={Shield} label="Role">
            <span className="inline-flex rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_9%,white)] px-3 py-1 text-xs font-bold text-[var(--stratex-blue)]">
              {formatRole(user.role || "")}
            </span>
          </DetailItem>

          <DetailItem icon={Building2} label="School">
            {user.school?.name || user.school || "Not Assigned"}
          </DetailItem>

          <DetailItem icon={Activity} label="Status">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                isActive
                  ? "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]"
                  : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]"
              }`}
            >
              {user.status || "Unknown"}
            </span>
          </DetailItem>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--border-light)] bg-[var(--surface-soft)] p-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--stratex-blue)] transition hover:bg-white/80 sm:w-auto"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(user)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--error)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 sm:w-auto"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
