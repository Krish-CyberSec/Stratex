import {
  Activity,
  Building2,
  Mail,
  Pencil,
  Shield,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import styled from "styled-components";

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
const formatRoles = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles].filter(Boolean);
  return roleList.map(formatRole).join(", ");
};

const getInitials = (user) =>
  [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("") || "?";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="grid grid-cols-[auto_minmax(82px,110px)_minmax(0,1fr)] items-center gap-2 py-3 text-xs sm:gap-3">
    <Icon size={16} className="text-[var(--university-muted)]" />
    <span className="font-semibold text-[var(--university-muted)]">
      {label}
    </span>
    <span className="min-w-0 break-words text-right font-bold text-[var(--university-ink)]">
      {value}
    </span>
  </div>
);
const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px 16px;

  border-radius: 10px;
  border: 1px solid transparent;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: all 160ms ease;

  &:active {
    transform: translateY(1px);
  }
`;

const EditButton = styled(ModalButton)`
  background: white;
  color: var(--text-primary);
  border-color: var(--border-light);

  &:hover {
    background: var(--surface-soft);
  }
`;

const DeleteButton = styled(ModalButton)`
  background: var(--error);
  color: white;

  &:hover {
    background: #b91c1c;
  }
`;

const UserDetails = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
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
        className="max-h-[90dvh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[var(--border-light)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_54%,#eef5ff_100%)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:p-5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border-light)] bg-white shadow-sm transition hover:bg-[var(--surface-soft)]"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex min-w-0 items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>Users</span>
              <span>/</span>
              <span className="min-w-0 truncate text-[var(--university-ink)]">
                {fullName || "User"}
              </span>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-lg font-bold text-[var(--stratex-blue)]">
                {getInitials(user)}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold leading-tight text-[var(--text-primary)] sm:text-3xl">
                  {fullName || "Unnamed User"}
                </h2>
                <p className="mt-2 max-w-2xl break-all text-sm font-medium leading-6 text-[var(--text-secondary)]">
                  {user.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <EditButton type="button" onClick={() => onEdit(user)}>
              <Pencil size={16} />
              Edit User
            </EditButton>
            <DeleteButton type="button" onClick={() => onDelete(user)}>
              <Trash2 size={16} />
              Delete User
            </DeleteButton>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--university-ink)]">
              <UserRound size={17} className="text-[var(--stratex-blue)]" />
              Profile Summary
            </h3>
            <p className="mt-4 text-sm font-medium leading-7 text-[var(--text-secondary)]">
              {fullName || "This user"} is registered as{" "}
              <span className="font-bold text-[var(--university-ink)]">
                {formatRoles(user.roles || user.role || "")}
              </span>{" "}
              under{" "}
              <span className="font-bold text-[var(--university-ink)]">
                {user.school?.name || user.school || "Not Assigned"}
              </span>
              .
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                  Role
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--university-ink)]">
                  {formatRoles(user.roles || user.role || "")}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                  Status
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    isActive
                      ? "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]"
                      : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]"
                  }`}
                >
                  {user.status || "Unknown"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-sm font-bold text-[var(--university-ink)]">
              User Information
            </h3>
            <div className="mt-4 divide-y divide-[var(--border-light)]">
              <InfoRow
                icon={Mail}
                label="Email"
                value={user.email || "No Email"}
              />
              <InfoRow
                icon={Shield}
                label="Role"
                value={formatRoles(user.roles || user.role || "")}
              />
              <InfoRow
                icon={Building2}
                label="School"
                value={user.school?.name || user.school || "Not Assigned"}
              />
              <InfoRow
                icon={Activity}
                label="Status"
                value={user.status || "Unknown"}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
