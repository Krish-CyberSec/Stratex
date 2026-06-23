import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CreateUser = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    personalEmail: "",
    school: "",
    roles: "",
    status: "active",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.personalEmail.trim() ||
      !formData.school.trim() ||
      !formData.roles
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");

    const newUser = {
      _id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.personalEmail,
      role: formData.roles,
      school: formData.school,
      status: formData.status,
    };

    navigate("/dashboard/users", {
      state: {
        newUser,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 border-l-4 border-[var(--stratex-gold)] pl-4 sm:pl-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--stratex-navy-light30)]">
              Administration
            </p>

            <h1 className="text-2xl font-semibold leading-tight text-[var(--stratex-navy)] sm:text-3xl">
              Create User
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Add a new user and assign their role, school, and account status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/users")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--university-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--university-blue-dark)] shadow-sm transition hover:bg-[var(--university-surface-soft)]"
          >
            <ArrowLeft size={17} />
            Back to Users
          </button>
        </header>

        <div className="overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm">
          <div className="border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-[var(--university-ink)]">
              User Information
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
              Enter the profile details for this account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-x-6 gap-y-5 p-4 sm:p-6 md:grid-cols-2"
          >
            {[
              {
                name: "firstName",
                label: "First Name",
                placeholder: "Enter first name",
              },
              {
                name: "lastName",
                label: "Last Name",
                placeholder: "Enter last name",
              },
              {
                name: "personalEmail",
                label: "Email Address",
                placeholder: "Enter email address",
              },
              {
                name: "school",
                label: "School",
                placeholder: "Enter school name",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                  {field.label}
                </label>

                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                Role
              </label>
              <select
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
              >
                <option value="">Select role</option>
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
                className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-[var(--error)] md:col-span-2">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-[var(--university-border)] pt-5 md:col-span-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard/users")}
                className="rounded-xl border border-[var(--university-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--university-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--university-blue-dark)]"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
