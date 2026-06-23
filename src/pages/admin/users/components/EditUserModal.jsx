import { useEffect, useState } from "react";

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
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
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
  onSave({ ...user, ...formData });
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--surface)] p-6 shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-[var(--text-primary)]">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] px-4 py-2" />
          <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] px-4 py-2" />

          <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] px-4 py-2">
            <option value="superAdmin">Super Admin</option>
            <option value="schoolAdmin">School Admin</option>
            <option value="faculty">Faculty</option>
            <option value="coordinator">Coordinator</option>
            <option value="student">Student</option>
            <option value="examCell">Exam Cell</option>
          </select>

          <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] px-4 py-2">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[var(--btn-primary)] px-4 py-2 font-semibold text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;