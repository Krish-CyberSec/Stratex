import { Pencil, Trash2, X } from "lucide-react";
import { Mail, Building2, Shield, Activity } from "lucide-react";
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
const UserDetails = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
      w-full
      max-w-3xl
      max-h-[90vh]
      overflow-y-auto
      rounded-3xl
      border
      border-[var(--university-border)]
      bg-white
      shadow-[0_20px_60px_rgba(15,23,42,0.18)]
      animate-in
    "
      >
        <div
          className="
    flex
    flex-col
    gap-4
    border-b
    border-[var(--university-border)]
    bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))]
    p-4
    sm:flex-row
    sm:items-center
    sm:justify-between
    sm:px-5
    sm:py-4
  "
        >
          <div className="border-b border-[var(--university-border)] p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="
flex
h-12
w-12
sm:h-16
sm:w-16
items-center
justify-center
rounded-2xl
bg-[color-mix(in_srgb,var(--university-blue)_12%,white)]
text-base
sm:text-lg
font-bold
text-[var(--university-blue)]
"
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--stratex-navy)]">
                  {user.firstName} {user.lastName}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-all">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold">User Details</h2>
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

        <div
          className="
    grid
    grid-cols-1
    gap-4
    p-4
    sm:p-6
    md:grid-cols-2
  "
        >
          <div
            className="rounded-2xl
border
border-[var(--university-border)]
bg-white
p-4 sm:p-5
shadow-[0_4px_14px_rgba(15,23,42,0.04)]
transition-all
hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              <Mail size={14} />
              Email
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-[var(--university-ink)]">
              {user.email || "No Email"}
            </p>
          </div>

          <div
            className="rounded-2xl
border
border-[var(--university-border)]
bg-white
p-4 sm:p-5
shadow-[0_4px_14px_rgba(15,23,42,0.04)]
transition-all
hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              <Shield size={14} />
              Role
            </p>
            <p className="mt-2 inline-flex rounded-full bg-[color-mix(in_srgb,var(--university-blue)_9%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--university-blue-dark)]">
              {formatRole(user.role)}
            </p>
          </div>

          <div
            className="rounded-2xl
border
border-[var(--university-border)]
bg-white
p-4 sm:p-5
shadow-[0_4px_14px_rgba(15,23,42,0.04)]
transition-all
hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              <Building2 size={14} />
              School
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--university-ink)]">
              {user.school || "Not Assigned"}
            </p>
          </div>

          <div
            className="rounded-2xl
border
border-[var(--university-border)]
bg-white
p-4 sm:p-5
shadow-[0_4px_14px_rgba(15,23,42,0.04)]
transition-all
hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              <Activity size={14} />
              Status
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                user.status?.toLowerCase() === "active"
                  ? "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]"
                  : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        <div
          className="
    flex
    flex-col
    gap-3
    border-t
    border-[var(--university-border)]
    bg-[var(--university-surface-soft)]
    p-4
    sm:flex-row
    sm:justify-end
    sm:px-6
    sm:py-5
  "
        >
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="
inline-flex
w-full
sm:w-auto
items-center
justify-center
gap-2
rounded-2xl
border
border-[#C8DAF5]
bg-white
px-6
py-3
font-semibold
text-[var(--university-blue)]
shadow-sm
transition-all
hover:-translate-y-0.5
hover:shadow-md
"
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete(user);
            }}
            className="
inline-flex
w-full
sm:w-auto
items-center
justify-center
gap-2
rounded-2xl
px-6
py-3
font-semibold
text-white
bg-[#E53935]
shadow-[0_6px_18px_rgba(229,57,53,0.25)]
transition-all
hover:-translate-y-0.5
hover:shadow-[0_10px_24px_rgba(229,57,53,0.35)]
"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
