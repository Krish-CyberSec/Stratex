import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
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
   <div className="min-h-screen bg-[var(--background)] px-4 py-6 md:px-8">
  <div className="mx-auto max-w-5xl rounded-lg border border-[var(--border-light)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
        <div className="mb-8 border-b border-[var(--border-light)] pb-5">
  <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
    Create User
  </h1>
  <p className="mt-1 text-sm text-[var(--text-secondary)]">
    Add a new user and assign their role
  </p>
</div>

        <form onSubmit={handleSubmit} className="grid gap-x-6 gap-y-5 md:grid-cols-2">
          {[
  { name: "firstName", label: "First Name", placeholder: "Enter first name" },
  { name: "lastName", label: "Last Name", placeholder: "Enter last name" },
  { name: "personalEmail", label: "Email Address", placeholder: "Enter email address" },
  { name: "school", label: "School", placeholder: "Enter school name" },
 
].map((field) => (
  <div key={field.name}>
    <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
      {field.label}
    </label>

    <input
      name={field.name}
      value={formData[field.name]}
      onChange={handleChange}
      placeholder={field.placeholder}
      className="w-full rounded-md border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--btn-primary)] focus:ring-2 focus:ring-blue-100"
    />
  </div>
))}

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
  Role
</label>
            <select name="roles" value={formData.roles} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5">
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
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
  Status
</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="rounded-lg bg-[var(--success)] px-6 py-2.5 font-semibold text-white shadow-md">
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;