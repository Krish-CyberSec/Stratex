import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createUser } from "../../../services/userService";
import { getSchools } from "../../../services/schoolService";
import { useAuth } from "../../../context/AuthContext";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const rolesThatNeedAssignments = ["student", "faculty", "coordinator"];

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
    const roles = [formData.role];

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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1150px]">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div
              className="
      inline-flex
      items-center
      rounded-full
bg-[#EEF5FC]
      px-4
      py-2
     text-[11px]
font-bold
tracking-[0.15em]
uppercase
      text-[var(--university-blue)]
    "
            >
              Administration
            </div>

            <h1
              className="
    mt-5
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
    text-base
    leading-7
    text-[var(--text-secondary)]
    sm:mt-3
  "
            >
              Add a new user and assign roles, permissions, and account status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(backPath)}
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
    sm:rounded-[28px]
    rounded-[28px]
border
border-[#E8EEF5]
bg-white
shadow-[0_8px_30px_rgba(15,23,42,0.04)]
    
  "
        >
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
            noValidate
            onSubmit={handleSubmit}
            className="grid gap-x-8 gap-y-7 p-8 lg:grid-cols-2"
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
                  className="mb-2 block text-[11px]
font-semibold
tracking-[0.15em]
uppercase
text-[var(--university-muted)]"
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
                  className="
  h-12
  w-full
  rounded-xl
  border
  border-[var(--university-border)]
  bg-white
  px-4
  text-sm
  font-medium
  text-[var(--stratex-navy)]
  shadow-sm
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
              <label
                htmlFor="schoolId"
                className="mb-2 block text-[11px]
font-semibold
tracking-[0.15em]
uppercase
text-[var(--university-muted)]"
              >
                School
              </label>
              <select
                name="schoolId"
                id="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                disabled={schoolsLoading}
                className="
  h-12 
  w-full
  rounded-xl
  border
  border-[var(--university-border)]
  bg-white
  px-4
  text-sm
  font-medium
  text-[var(--stratex-navy)]
  shadow-sm
  transition-all
  duration-200
  hover:border-[var(--university-blue)]
  focus:border-[var(--university-blue)]
  focus:ring-4
  focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
  disabled:cursor-not-allowed
  disabled:opacity-70
"
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
                className="mb-2 block text-[11px]
font-semibold
tracking-[0.15em]
uppercase
text-[var(--university-muted)]"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="
  h-12 
  w-full
  rounded-xl
  border
  border-[var(--university-border)]
  bg-white
  px-4
  text-sm
  font-medium
  text-[var(--stratex-navy)]
  shadow-sm
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
              {selectedRoleNeedsAssignments && (
                <p className="mt-2 text-xs font-medium text-[var(--university-muted)]">
                  This role requires academic assignment data before it can be
                  created.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-[11px]
font-semibold
tracking-[0.15em]
uppercase
text-[var(--university-muted)]"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="
h-12
w-full
rounded-xl
border
border-[var(--university-border)]
bg-white
px-4
text-sm
text-[var(--university-ink)]
outline-none
transition
focus:border-[var(--university-blue)]
focus:ring-4
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
                onClick={() => navigate(backPath)}
                className="
w-full
sm:w-auto
rounded-xl
border
bg-[#FBFCFD]
border-[#E4EAF2]
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
rounded-xl
bg-[var(--university-blue)]
px-6
py-3
text-sm
font-semibold
text-white
shadow-md
hover:shadow-lg
transition-all
duration-200
hover:-translate-y-0.5
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
