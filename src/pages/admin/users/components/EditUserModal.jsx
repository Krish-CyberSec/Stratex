import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
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
const EditUserModal = ({ user, onClose, onSave, loading = false }) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    personalEmail: "",
    status: "active",
  });
  const handleClose = useCallback(() => {
    if (loading) return;
    onClose?.();
  }, [loading, onClose]);
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        personalEmail: user.personalEmail || user.email || "",
        status: user.status || "active",
      });

      setError("");
    }
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading, handleClose]);
  if (!user) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    onSave?.({ ...user, ...formData });
  };

  return (
    <div
      className="
        fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
backdrop-blur-sm
p-4
      "
      onClick={(e) => {
        if (loading) return;
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
        aria-describedby="edit-user-description"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85dvh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative border-b border-[var(--border-light)] bg-[var(--surface-soft)] p-5 pr-14 sm:p-6 sm:pr-16">
          <div className="pr-12">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-lg font-bold text-[var(--stratex-blue)]">
                {[formData.firstName?.[0], formData.lastName?.[0]]
                  .filter(Boolean)
                  .join("") || "?"}
              </div>

              <div className="min-w-0">
                <h3
                  id="edit-user-title"
                  className="truncate text-xl font-bold text-[var(--university-ink)]"
                >
                  {formData.firstName} {formData.lastName}
                </h3>

                <p className="mt-1 break-all text-sm font-medium text-[var(--university-muted)]">
                  {user.email}
                </p>

                <p
                  id="edit-user-description"
                  className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--university-muted)]"
                >
                  Edit User
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close edit modal"
            onClick={handleClose}
            disabled={loading}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)] disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid max-h-[calc(85dvh-9rem)] gap-x-5 gap-y-5 overflow-y-auto p-4 sm:p-6 md:grid-cols-2"
        >
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
            >
              First Name
            </label>
            <input
              type="text"
              autoFocus
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-medium text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)] disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-medium text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)] disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div>
            <p className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              Role
            </p>

            <p
              className="flex h-11 items-center rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] px-3 text-sm font-semibold text-[var(--university-ink)]"
            >
              {formatRoles(user.roles || user.role)}
            </p>
          </div>
          <div>
            <label
              htmlFor="personalEmail"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
            >
              Personal Email
            </label>
            <input
              type="email"
              id="personalEmail"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-medium text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)] disabled:cursor-not-allowed disabled:opacity-70"
            ></input>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-3">
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
                {error}
              </p>
            )}
            <div
              className="flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-5 sm:flex-row sm:justify-end"
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
