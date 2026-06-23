import { useMemo, useState, useEffect } from "react";
import UserDetails from "./components/UserDetails";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2, UsersRound } from "lucide-react";

const mockUsers = [
  {
    _id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    role: "Student",
    school: "School of Engineering & Technology",
    status: "active",
  },
  {
    _id: 2,
    firstName: "Aarav",
    lastName: "Mehta",
    email: "aarav@test.com",
    role: "Faculty",
    school: "School of Management",
    status: "active",
  },
  {
    _id: 3,
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@test.com",
    role: "School Admin",
    school: "School of Law",
    status: "inactive",
  },
];

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const newUser = location.state?.newUser;

    if (!newUser) return;

    setUsers((prevUsers) => {
      const alreadyExists = prevUsers.some((user) => user._id === newUser._id);

      if (alreadyExists) {
        return prevUsers;
      }

      return [...prevUsers, newUser];
    });

    navigate(location.pathname, { replace: true });
  }, [location.state, location.pathname, navigate]);
  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
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
      const value =
        `${user.firstName} ${user.lastName} ${user.email} ${user.role} ${user.status}`.toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 border-l-4 border-[var(--stratex-gold)] pl-4 sm:pl-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--stratex-navy-light30)]">
              Administration
            </p>

            <h1 className="text-2xl font-semibold leading-tight text-[var(--stratex-navy)] sm:text-3xl">
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Manage user profiles, roles, schools, and account access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/users/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--university-blue)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--university-blue-dark)]"
          >
            <Plus size={17} />
            Create User
          </button>
        </header>

        <div className="overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]">
                <UsersRound size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[var(--university-ink)]">
                  User Directory
                </h2>
                <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
                  {filteredUsers.length} users shown
                </p>
              </div>
            </div>
          </div>
          <div className="border-b border-[var(--university-border)] px-4 py-4 sm:px-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              Search
            </label>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--university-muted)]"
              />

              <input
                type="text"
                placeholder="Search by name, email, role, or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[var(--university-border)] bg-white py-3 pl-11 pr-4 text-sm text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--university-border)] bg-[var(--university-surface-soft)]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-[var(--university-border)] transition hover:bg-[var(--university-surface-soft)]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-xs font-semibold text-[var(--university-blue-dark)]">
                          {getInitials(user.firstName, user.lastName)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[var(--university-ink)]">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
                            {user.school}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--university-muted)]">
                      {user.email}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--university-muted)]">
                      {user.role}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.status === "active"
                            ? "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]"
                            : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
                          title="View user"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--university-gold)_46%,white)] text-[var(--university-ink)] transition hover:bg-[color-mix(in_srgb,var(--university-gold)_18%,white)]"
                          title="Edit user"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingUser(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-[var(--error)] transition hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)]">
                          <UsersRound size={20} />
                        </div>

                        <p className="text-sm font-semibold text-[var(--university-ink)]">
                          No users found
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[var(--university-muted)]">
                          Try changing your search term or create a new user.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
