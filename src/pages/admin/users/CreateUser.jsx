import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createUser } from "../../../services/userService";
import { getSchools } from "../../../services/schoolService";
import { useAuth } from "../../../context/AuthContext";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const rolesThatNeedAssignments = ["student", "faculty", "coordinator"];
const allRoleOptions = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "schoolAdmin", label: "School Admin" },
  { value: "faculty", label: "Faculty" },
  { value: "coordinator", label: "Coordinator" },
  { value: "student", label: "Student" },
  { value: "examCell", label: "Exam Cell" },
];
const schoolAdminRoleOptions = allRoleOptions.filter((role) =>
  ["student", "faculty", "coordinator"].includes(role.value),
);

const CreateUser = () => {
  const [error, setError] = useState("");
  const [schoolsError, setSchoolsError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    personalEmail: "",
    universityEmail: "",
    institutionId: "",
    schoolId: "",
    role: "",
    status: "active",
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const canViewUsers = user?.roles?.includes("superAdmin");
  const backPath = canViewUsers ? "/dashboard/users" : "/dashboard";
  const roleOptions = canViewUsers ? allRoleOptions : schoolAdminRoleOptions;

  useEffect(() => {
    let isMounted = true;

    const loadSchools = async () => {
      setSchoolsLoading(true);
      setSchoolsError("");

      try {
        const response = await getSchools({
          page: 1,
          limit: 100,
          status: "active",
          sortBy: "name",
          order: "asc",
        });

        if (isMounted) {
          setSchools(response.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setSchoolsError(getErrorMessage(err, "Unable to load schools"));
        }
      } finally {
        if (isMounted) {
          setSchoolsLoading(false);
        }
      }
    };

    loadSchools();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedRoleNeedsAssignments = useMemo(
    () => rolesThatNeedAssignments.includes(formData.role),
    [formData.role],
  );
  const selectedRoleNeedsSchool = formData.role && formData.role !== "superAdmin";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: [
        "personalEmail",
        "universityEmail",
        "institutionId",
        "schoolId",
        "role",
        "status",
      ].includes(name)
        ? value
        : value.replace(/^\s+/, ""),
    }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    if (!formData.firstName.trim()) {
      setError("First name is required.");
      document.getElementById("firstName")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      document.getElementById("lastName")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (!formData.personalEmail.trim()) {
      setError("Email is required.");
      document.getElementById("personalEmail")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (selectedRoleNeedsSchool && !formData.universityEmail.trim()) {
      setError("University email is required.");
      document.getElementById("universityEmail")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (selectedRoleNeedsSchool && !formData.institutionId.trim()) {
      setError("Institution ID is required.");
      document.getElementById("institutionId")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (selectedRoleNeedsSchool && !formData.schoolId) {
      setError("School is required.");
      document.getElementById("schoolId")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (!formData.role) {
      setError("Please select a role.");
      document.getElementById("role")?.focus();
      setIsSubmitting(false);
      return;
    }

    if (selectedRoleNeedsAssignments) {
      setError(
        "Student, faculty, and coordinator users need academic assignments. Please create this role from the school/program assignment flow.",
      );
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(formData.personalEmail.trim())) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (
      formData.universityEmail.trim() &&
      !emailRegex.test(formData.universityEmail.trim())
    ) {
      setError("Please enter a valid university email address.");
      document.getElementById("universityEmail")?.focus();
      setIsSubmitting(false);
      return;
    }

    const firstName = formData.firstName.trim().replace(/\s+/g, " ");
    const lastName = formData.lastName.trim().replace(/\s+/g, " ");
    const roles =
      formData.role === "coordinator"
        ? ["faculty", "coordinator"]
        : [formData.role];

    const payload = {
      firstName,
      lastName,
      personalEmail: formData.personalEmail.trim().toLowerCase(),
      roles,
      status: formData.status,
    };

    if (formData.universityEmail.trim() || formData.institutionId.trim()) {
      payload.universityAccount = {
        universityEmail: formData.universityEmail.trim().toLowerCase(),
        institutionId: formData.institutionId.trim(),
      };
    }

    if (formData.schoolId) {
      payload.schoolId = formData.schoolId;
    }

    try {
      await createUser(payload);
      navigate(backPath, {
        state: canViewUsers ? { message: "User created successfully" } : undefined,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create user"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_48%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-4xl space-y-5">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>

        <header className="rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
              <UserPlus size={24} />
            </div>
          <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--university-muted)]">
                Administration
              </p>
            <h1 className="mt-1 text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
              Create User
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
              Add a new user and assign roles, permissions, and account status.
            </p>
          </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
          <div className="border-b border-[var(--border-light)] bg-[var(--surface-soft)] px-4 py-4 sm:px-6">
            <h2 className="text-base font-bold text-[var(--university-ink)]">
              User Information
            </h2>
            <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">
              Enter the profile details for this account
            </p>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit}
            className="grid gap-x-5 gap-y-5 p-4 sm:p-6 lg:grid-cols-2"
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
                label: "Personal Email",
                placeholder: "Enter personal email",
              },
              {
                name: "universityEmail",
                label: "University Email",
                placeholder: "Enter university email",
              },
              {
                name: "institutionId",
                label: "Institution ID",
                placeholder: "Enter institution ID",
              },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
                >
                  {field.label}
                </label>

                <input
                  type={
                    ["personalEmail", "universityEmail"].includes(field.name)
                      ? "email"
                      : "text"
                  }
                  name={field.name}
                  value={formData[field.name]}
                  id={field.name}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  maxLength={
                    ["personalEmail", "universityEmail"].includes(field.name)
                      ? 254
                      : 50
                  }
                  className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-medium text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="schoolId"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
              >
                School
              </label>
              <select
                name="schoolId"
                id="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                disabled={schoolsLoading}
                className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">
                  {schoolsLoading ? "Loading schools..." : "Select school"}
                </option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>
                    {school.name}
                  </option>
                ))}
              </select>
              {schoolsError && (
                <p className="mt-2 text-xs font-medium text-[var(--error)]">
                  {schoolsError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
              >
                <option value="">Select role</option>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {selectedRoleNeedsAssignments && (
                <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  This role requires academic assignment data before it can be
                  created.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)]"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)] md:col-span-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-[var(--border-light)] pt-5 md:col-span-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(backPath)}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)] sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CreateUser;
