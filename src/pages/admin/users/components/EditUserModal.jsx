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
        className="
          w-full
         max-w-2xl
lg:max-w-3xl
max-h-[85dvh] 
          overflow-y-auto
          overflow-x-hidden
          rounded-3xl
          border
          border-[var(--university-border)]
          bg-white
          shadow-[0_20px_60px_rgba(15,23,42,0.18)]
        "
      >
        <div
          className="
    relative
    flex
    flex-col
    gap-3
    border-b
    border-[var(--university-border)]
    bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))]
    px-4
    py-3
    sm:px-5
    sm:py-4
  "
        >
          <div className="pr-12">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="
          flex
          h-10
          w-10
          sm:h-16
          sm:w-16
          items-center
          justify-center
          rounded-2xl
          bg-[color-mix(in_srgb,var(--university-blue)_12%,white)]
          text-sm
          sm:text-lg
          font-bold
          text-[var(--university-blue)]
        "
              >
                {[formData.firstName?.[0], formData.lastName?.[0]]
                  .filter(Boolean)
                  .join("") || "?"}
              </div>

              <div className="min-w-0">
                <h3
                  id="edit-user-title"
                  className="text-lg sm:text-xl font-bold text-[var(--stratex-navy)]"
                >
                  {formData.firstName} {formData.lastName}
                </h3>

                <p className="break-all text-xs sm:text-sm text-[var(--text-secondary)]">
                  {formData.personalEmail || user.email}
                </p>

                <div className="mt-3">
                  <h2 className="text-sm sm:text-base font-semibold text-[var(--stratex-navy)]">
                    Edit User
                  </h2>

                  <p
                    id="edit-user-description"
                    className="mt-0.5 text-xs font-medium text-[var(--university-muted)]"
                  >
                    Update profile and account information
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close edit modal"
            onClick={handleClose}
            disabled={loading}
            className="
      absolute
      top-3
      right-3
      sm:top-4
      sm:right-4
      inline-flex
      h-9
      w-9
      items-center
      justify-center
      rounded-full
      border
      border-[var(--university-border)]
      text-[var(--university-blue-dark)]
      transition
      hover:bg-[var(--university-surface-soft)]
      disabled:opacity-50
    "
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-x-6 gap-y-6 p-6 "
        >
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]"
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
              className="
                h-11 sm:h-12
                w-full
                rounded-2xl
                border
                border-[var(--university-border)]
                bg-white
                px-4
                text-sm
                font-medium
                text-[var(--stratex-navy)]
                shadow-sm
                transition-all
                focus:border-[var(--university-blue)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
                focus:outline-none
              "
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]"
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
              className="
                h-11 sm:h-12
                w-full
                rounded-2xl
                border
                border-[var(--university-border)]
                bg-white
                px-4
                text-sm
                font-medium
                text-[var(--stratex-navy)]
                shadow-sm
                transition-all
                focus:border-[var(--university-blue)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
                focus:outline-none
              "
            />
          </div>

          <div>
            <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              Role
            </p>

            <p
              className="
      flex
      h-12
      items-center
      rounded-2xl
      border
      border-[var(--university-border)]
      bg-gray-50
      px-4
      text-sm
      font-medium
      text-[var(--stratex-navy)]
    "
            >
              {formatRole(user.role)}
            </p>
          </div>
          <div>
            <label
              htmlFor="personalEmail"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]"
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
              className=" h-11 sm:h-12
                w-full
                rounded-2xl
                border
                border-[var(--university-border)]
                bg-white
                px-4
                text-sm
                font-medium
                text-[var(--stratex-navy)]
                shadow-sm
                transition-all
                focus:border-[var(--university-blue)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
                focus:outline-none
              "
            ></input>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-12 rounded-2xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-3">
            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}
            <div
              className="
              flex
              flex-col-reverse
              gap-3 
              sm:flex-row
              sm:justify-end
              border-t
              border-[var(--university-border)]
              pt-6
              
            "
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="
                rounded-2xl
                border
                border-[var(--university-border)]
                bg-white
                px-6
                py-3
                font-semibold
                text-[var(--stratex-navy)]
                transition-all
                md:hover:bg-[var(--background)]
                md:hover:shadow-md
                disabled:cursor-not-allowed disabled:opacity-60
              "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                rounded-2xl
                bg-[var(--university-blue)]
                px-6
                py-3
                font-semibold
                text-white
                shadow-[0_8px_20px_rgba(37,99,235,0.25)]
                transition-all
                md:hover:-translate-y-0.5
                md:hover:shadow-[0_12px_28px_rgba(37,99,235,0.35)]
                disabled:cursor-not-allowed disabled:opacity-60
              "
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
