import { useMemo, useState, useEffect } from "react";
import UserDetails from "./components/UserDetails";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import { useLocation, useNavigate } from "react-router-dom";
import Datatable from "../../../components/users/Datatable";
import SearchBar from "../../../components/users/SearchBar";
import DashboardStatCard from "../../../components/common/DashboardStatCard";
import {
  Pencil,
  Plus,
  Trash2,
  MoreVertical,
  UsersRound,
  Users as UsersIcon,
  UserCheck,
  GraduationCap,
} from "lucide-react";

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
const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};
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

const Users = () => {
  useEffect(() => {
    const closeMenu = () => setOpenMenu(null);

    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem("users");
      return savedUsers ? JSON.parse(savedUsers) : mockUsers;
    } catch {
      return mockUsers;
    }
  });
  const totalUsers = users.length;

  const activeUsers = useMemo(
    () => users.filter((user) => user.status === "active").length,
    [users],
  );

  const facultyUsers = useMemo(
    () => users.filter((user) => user.role === "faculty").length,
    [users],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, sortBy]);
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
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
    let result = users.filter((user) => {
      const value = `
      ${user.firstName || ""}
      ${user.lastName || ""}
      ${user.email || ""}
      ${user.role || ""}
      ${user.school || ""}
      ${user.status || ""}
    `
        .toLowerCase()
        .trim();

      return value.includes(searchTerm.toLowerCase());
    });

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        ),
      );
    }

    if (sortBy === "role") {
      result.sort((a, b) => (a.role || "").localeCompare(b.role || ""));
    }

    return result;
  }, [users, searchTerm, roleFilter, sortBy]);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-[var(--background)] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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

            <h1 className="mt-3 text-3xl font-bold leading-none sm:text-4xl">
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 sm:text-base">
              Manage user profiles, roles, schools, and account access.
            </p>
          </div>
        </header>
        <div
          className="
  mt-6
  grid
  grid-cols-1
  gap-4
  sm:grid-cols-2
  lg:grid-cols-4
"
        >
          <DashboardStatCard
            title="Total Users"
            value={totalUsers}
            icon={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <UsersIcon size={18} />
              </div>
            }
          />

          <DashboardStatCard
            title="Active Users"
            value={activeUsers}
            icon={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <UserCheck size={18} />
              </div>
            }
          />

          <DashboardStatCard
            title="Faculty Members"
            value={facultyUsers}
            icon={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <GraduationCap size={18} />
              </div>
            }
          />

          <DashboardStatCard
            title="Quick Action"
            value="+"
            onClick={() => navigate("/dashboard/users/create")}
            className="
    bg-[var(--university-blue)]
    border-[var(--university-blue)]
    cursor-pointer
  "
            titleClassName="text-white"
            valueClassName="text-white"
            actionClassName="
    bg-white/10
    border-white/20
    text-white
  "
            footer={
              <span className="text-white/80">Create a new user account</span>
            }
            icon={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                <Plus size={18} />
              </div>
            }
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]">
                <UsersRound size={18} />
              </div>

              <div className="min-w-0">
                <div>
                  <h2 className="text-base font-semibold">All Users</h2>

                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {filteredUsers.length} users found
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-[var(--university-border)] p-5">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          <div className="md:block overflow-x-auto ">
           <div className="max-h-[600px] overflow-auto"> 
            <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left">
              
              <thead>
                <tr
                  className="
  border-b
  border-[var(--university-border)]
  transition-all
  duration-200
  bg-[color-mix(in_srgb,var(--university-blue)_6%,white)]
"
                >
                  <th
                    className="
    px-3 py-3 sm:px-5 sm:py-4
    text-left
    text-[11px]
    font-bold
    uppercase
    tracking-[0.12em]
    text-[var(--university-blue)]
  "
                  >
                    Name
                  </th>
                  <th
                    className="
    px-3 py-3 sm:px-5 sm:py-4
    text-left
    text-[11px]
    font-bold
    uppercase
    tracking-[0.12em]
    text-[var(--university-blue)]
  "
                  >
                    Email
                  </th>
                  <th
                    className="
    px-3 py-3 sm:px-5 sm:py-4
    text-left
    text-[11px]
    font-bold
    uppercase
    tracking-[0.12em]
    text-[var(--university-blue)]
  "
                  >
                    Role
                  </th>
                  <th
                    className="
    px-3 py-3 sm:px-5 sm:py-4
    text-left
    text-[11px]
    font-bold
    uppercase
    tracking-[0.12em]
    text-[var(--university-blue)]
  "
                  >
                    Status
                  </th>
                  <th
                    className="
   px-3 py-3 sm:px-5 sm:py-4
    text-left
    text-[11px]
    font-bold
    uppercase
    tracking-[0.12em]
    text-[var(--university-blue)]
  "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="space-y-3">
                {paginatedUsers.map((user) => (
                  <tr
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                    key={user._id}
                    className={`
    cursor-pointer
    relative
    rounded-2xl
    ${openMenu === user._id ? "z-50" : "z-0"}
    bg-white
    shadow-sm
    transition-all
    duration-200
    md:hover:-translate-y-[2px]
    md:hover:shadow-lg
    md:hover:bg-[color-mix(in_srgb,var(--university-blue)_3%,white)]
                  `}
                  >
                    <td className=" px-3 py-3 sm:px-5 sm:py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className="
    flex
    h-9
w-9
sm:h-11
sm:w-11
    shrink-0
    items-center
    justify-center
    rounded-full
    bg-gradient-to-br
    from-blue-100
    to-blue-50
    text-sm
    font-bold
    text-[var(--university-blue)]
    ring-2
    ring-white
  "
                        >
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
                    <td className="px-3 py-3 sm:px-5 sm:py-4 text-sm text-[var(--university-muted)]">
                      {user.email}
                    </td>
                    <td className="px-3 py-3 sm:px-5 sm:py-4 text-sm text-[var(--university-muted)]">
                      <span
                        className="
    inline-flex
    rounded-full
    bg-blue-50
    px-3
    py-1
    text-xs
    font-semibold
    text-blue-700
  "
                      >
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-3 py-3 sm:px-5 sm:py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.status?.toLowerCase() === "active"
                            ? "inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200"
                            : "inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="relative  px-4 py-4 overflow-visible">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === user._id ? null : user._id);
                        }}
                        className="
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-xl
      border
      border-[var(--university-border)]
      text-[var(--text-secondary)]
      transition-all
      md:hover:bg-[var(--university-surface-soft)]
      md:hover:text-[var(--university-blue)]
    "
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenu === user._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="
    absolute
    right-0 sm:right-4
    top-full mt-2
    z-[999]
    w-52
    rounded-2xl
    border
    border-[var(--university-border)]
    bg-white
    p-2
    shadow-[0_20px_40px_rgba(15,23,42,0.18)]
  "
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedUser(null);
                              setEditingUser(user);
                              setOpenMenu(null);
                            }}
                            className="
    mx-2
    my-1
    flex
    w-[calc(100%-16px)]
    cursor-pointer
    items-center
    gap-3
    rounded-xl
    px-4
    py-3
    text-sm
    font-medium
    text-[var(--stratex-navy)]
    transition-all
    duration-200
    md:hover:scale-[1.02]
    md:hover:bg-[color-mix(in_srgb,var(--stratex-gold)_14%,white)]
    md:hover:shadow-md
  "
                          >
                            <Pencil size={16} />
                            Edit User
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedUser(null);
                              setDeletingUser(user);
                              setOpenMenu(null);
                            }}
                            className="
    mx-2
    mb-2
    mt-1
    flex
    w-[calc(100%-16px)]
    cursor-pointer
    items-center
    gap-3
    rounded-xl
    px-4
    py-3
    text-sm
    font-medium
    text-red-600
    transition-all
    duration-200
    md:hover:scale-[1.02]
    md:hover:bg-red-50
    md:hover:shadow-md
  "
                          >
                            <Trash2 size={16} />
                            Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-14 w-14 shadow-sm items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)]">
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
          <Datatable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--university-border)] px-5 py-4">
            <p className="text-sm text-[var(--text-secondary)]">
              {filteredUsers.length === 0
                ? "Showing 0 users"
                : `Showing ${startIndex + 1} - ${Math.min(
                    startIndex + USERS_PER_PAGE,
                    filteredUsers.length,
                  )} of ${filteredUsers.length} users`}
            </p>
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
