import { useEffect, useState } from "react";
import { X } from "lucide-react";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "student",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.role || "student",
        status: user.status || "active",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
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
        overflow-y-auto
        py-6
        bg-black/40
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-2xl
          max-h-[90vh]  
          overflow-y-auto
          overflow-x-hidden
          rounded-2xl sm:rounded-3xl
          border
          border-[var(--university-border)]
          bg-white
          shadow-[0_20px_60px_rgba(15,23,42,0.18)]
        "
      >
        <div className="flex items-center justify-between border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--university-ink)]">
              Edit User
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
              Update this user's role and account status
            </p>
          </div>

          <button
            type="button"
            aria-label="Close edit modal"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition md:hover:bg-[var(--university-surface-soft)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="border-b border-[var(--university-border)] px-6 py-5">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div
              className="
                flex
                h-14
                w-14
                sm:h-16
                sm:w-16
                items-center
                justify-center
                rounded-2xl
                bg-[color-mix(in_srgb,var(--university-blue)_12%,white)]
                text-base sm:text-lg
                font-bold
                text-[var(--university-blue)]
              "
            >
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--stratex-navy)]">
                {user.firstName} {user.lastName}
              </h3>

              <p className="break-all text-sm text-[var(--text-secondary)]">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            grid
            gap-5
            p-4 sm:p-6
            md:grid-cols-2
          "
        >
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
            >
              <option value="superAdmin">Super Admin</option>
              <option value="schoolAdmin">School Admin</option>
              <option value="faculty">Faculty</option>
              <option value="coordinator">Coordinator</option>
              <option value="student">Student</option>
              <option value="examCell">Exam Cell</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div
            className="
              md:col-span-2
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
              onClick={onClose}
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
              "
            >
              Cancel
            </button>

            <button
              type="submit"
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
              "
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
