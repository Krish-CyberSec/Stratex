import { useMemo, useState, useEffect } from "react";
import UserDetails from "./components/UserDetails";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import { useLocation, useNavigate } from "react-router-dom";


const mockUsers = [
  {
    _id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    role: "student",
    school: "School of Engineering & Technology",
    status: "active",
  },
  {
    _id: 2,
    firstName: "Aarav",
    lastName: "Mehta",
    email: "aarav@test.com",
    role: "faculty",
    school: "School of Management",
    status: "active",
  },
  {
    _id: 3,
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@test.com",
    role: "schoolAdmin",
    school: "School of Law",
    status: "inactive",
  },
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
  if (location.state?.newUser) {
    setUsers((prevUsers) => [...prevUsers, location.state.newUser]);

    navigate(location.pathname, { replace: true });
  }
}, [location.state, location.pathname, navigate]);
  const handleUpdateUser = (updatedUser) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user._id === updatedUser._id ? updatedUser : user
    )
  );

  setEditingUser(null);

  if (selectedUser?._id === updatedUser._id) {
    setSelectedUser(updatedUser);
  }
};
  const handleDeleteUser = (userId) => {
  setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  setDeletingUser(null);

  if (selectedUser?._id === userId) {
    setSelectedUser(null);
  }
};
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const value = `${user.firstName} ${user.lastName} ${user.email} ${user.role} ${user.status}`.toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Users</h1>
<p className="text-sm text-[var(--text-secondary)]">
  Manage university users, roles, and account status.
</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/users/create")}
          className="rounded-lg bg-[var(--success)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Create User
        </button>
      </div>

      <div className="rounded-xl bg-[var(--surface)] p-5 shadow-md">
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
            Search User
          </label>
          <input
            type="text"
            placeholder="Search by name, email, role, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--btn-primary)] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">Role</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-[var(--border-light)]">
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--text-secondary)]">{user.email}</td>
                  <td className="px-4 py-4 text-sm capitalize text-[var(--text-secondary)]">{user.role}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-[var(--success)]"
                          : "bg-red-100 text-[var(--error)]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedUser(user)} className="rounded-md bg-[var(--btn-primary)] px-3 py-1.5 text-xs font-semibold text-white">
                        View
                      </button>
                      <button onClick={() => setEditingUser(user)} className="rounded-md bg-[var(--warning)] px-3 py-1.5 text-xs font-semibold text-white">
                        Edit
                      </button>
                      <button onClick={() => setDeletingUser(user)} className="rounded-md bg-[var(--error)] px-3 py-1.5 text-xs font-semibold text-white">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetails
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onEdit={setEditingUser}
        onDelete={setDeletingUser}
      />

      <EditUserModal
  user={editingUser}
  onClose={() => setEditingUser(null)}
  onSave={handleUpdateUser}
/>
      <DeleteUserModal
  user={deletingUser}
  onClose={() => setDeletingUser(null)}
  onDelete={handleDeleteUser}
/>
    </div>
  );
};

export default Users;