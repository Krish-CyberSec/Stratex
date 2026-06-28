import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CreateUser = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;

    setIsSubmitting(true);
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.personalEmail.trim() ||
      !formData.school.trim() ||
      !formData.roles
    ) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.personalEmail)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.personalEmail.trim();
    const school = formData.school.trim();
    const newUser = {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      firstName,
      lastName,
      email,
      school,
      role: formData.roles,
      status: formData.status,
    };

    setIsSubmitting(false);
    navigate("/dashboard/users", {
      state: {
        newUser,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div
              className="
      inline-flex
      items-center
      rounded-full
      bg-[color-mix(in_srgb,var(--university-blue)_10%,white)]
      px-4
      py-2
      text-xs
      font-semibold
      uppercase
      tracking-[0.15em]
      text-[var(--university-blue)]
    "
            >
              Administration
            </div>

            <h1
              className="
    mt-3
    text-3xl
    font-bold
    leading-none
    text-[var(--stratex-navy)]
    sm:text-4xl
  "
            >
              Create User
            </h1>

            <p
              className="
    mt-2
    max-w-2xl
    text-sm
    leading-6
    text-[var(--text-secondary)]
    sm:mt-3
  "
            >
              Add a new user and assign roles, permissions, and account status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/users")}
            className="
inline-flex
w-full
items-center
justify-center
gap-2
rounded-xl
border
border-[var(--university-border)]
bg-white
px-4
py-2.5
text-sm
font-semibold
text-[var(--university-blue-dark)]
shadow-sm
transition
hover:bg-[var(--university-surface-soft)]
sm:w-auto
"
          >
            <ArrowLeft size={17} />
            Back to Users
          </button>
        </header>

        <div
          className="
    overflow-hidden
    rounded-2xl
    sm:rounded-[28px]
    border
    border-[var(--university-border)]
    bg-white
    shadow-[0_12px_40px_rgba(15,23,42,0.06)]
  "
        >
          {" "}
          <div className="border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-[var(--stratex-navy)]">
              {" "}
              User Information
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
              Enter the profile details for this account
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid gap-x-6 gap-y-5 p-4 sm:p-6 lg:grid-cols-2"
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
                  type={field.name === "personalEmail" ? "email" : "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="
  h-12 sm:h-14
  w-full
  rounded-2xl
  border
  border-[var(--university-border)]
  bg-white
  px-4
  text-sm
  font-medium
  text-[var(--stratex-navy)]
  shadow-[0_2px_8px_rgba(15,23,42,0.03)]
  outline-none
  transition-all
  duration-200
  hover:border-[var(--university-blue)]
  focus:border-[var(--university-blue)]
  focus:ring-4
  focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
"
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
                className="
  h-12 sm:h-14
  w-full
  rounded-2xl
  border
  border-[var(--university-border)]
  bg-white
  px-4
  text-sm
  font-medium
  text-[var(--stratex-navy)]
  shadow-[0_2px_8px_rgba(15,23,42,0.03)]
  transition-all
  duration-200
  hover:border-[var(--university-blue)]
  focus:border-[var(--university-blue)]
  focus:ring-4
  focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
"
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
                className="
h-12
sm:h-14
w-full
rounded-2xl
border
border-[var(--university-border)]
bg-white
px-4
text-sm
text-[var(--university-ink)]
outline-none
transition
focus:border-[var(--university-blue)]
focus:ring-2
focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]
"
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

            <div
              className="
    flex
    flex-col
    gap-3
    border-t
    border-[var(--university-border)]
    pt-5
    md:col-span-2
    sm:flex-row
    sm:justify-end
  "
            >
              <button
                type="button"
                onClick={() => navigate("/dashboard/users")}
                className="
w-full
sm:w-auto
rounded-2xl
border
border-[var(--university-border)]
bg-white
px-6
py-3
text-sm
font-semibold
text-[var(--stratex-navy)]
shadow-sm
transition-all
duration-200
hover:-translate-y-0.5
hover:shadow-md
cursor-pointer
"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
inline-flex
w-full
sm:w-auto
items-center
justify-center
gap-2
rounded-2xl
bg-[var(--university-blue)]
px-6
py-3
text-sm
font-semibold
text-white
shadow-[0_8px_20px_rgba(37,99,235,0.25)]
transition-all
duration-200
hover:-translate-y-0.5
hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)]
disabled:opacity-60
disabled:cursor-not-allowed
disabled:hover:translate-y-0
cursor-pointer
"
              >
                {" "}
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
