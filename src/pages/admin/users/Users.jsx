import {
  getUsers,
  updateUser,
  deleteUser,
} from "../../../services/userService";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import UserDetails from "./components/UserDetails";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import { useLocation, useNavigate } from "react-router-dom";
import Datatable from "../../../components/users/DataTable";
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
const normalizeUser = (user) => {
  return {
    ...user,
    role: user.roles?.[0] || user.role || "student",
    email:
      user.universityAccount?.universityEmail ||
      user.personalEmail ||
      user.email ||
      "No email",
    school: user.schoolId?.name || user.school || "Not Assigned",
  };
};
const USERS_PER_PAGE = 10;
const Users = () => {
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const menuButtonRefs = useRef({});
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [pagination, setPagination] = useState({
    limit: USERS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getUsers({
        page: currentPage,
        limit: USERS_PER_PAGE,
        search: searchTerm.trim() || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        sortBy: sortBy === "name" ? "firstName" : "createdAt",
        order: sortBy === "name" ? "asc" : "desc",
      });

      const backendUsers = response.data?.data || [];
      const backendPagination = response.data?.pagination;

      setUsers(backendUsers.map(normalizeUser));
      if (backendPagination) {
        const { page, ...rest } = backendPagination;
        setPagination(rest);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, sortBy]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const activeUsers = useMemo(
    () => users.filter((user) => user.status === "active").length,
    [users],
  );

  const facultyUsers = useMemo(
    () => users.filter((user) => user.role === "faculty").length,
    [users],
  );

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openMenu &&
        !event.target.closest(".floating-user-menu") &&
        !event.target.closest(".menu-trigger")
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, sortBy]);
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);
  useEffect(() => {
    const newUser = location.state?.newUser;

    if (!newUser) return;

    fetchUsers();
    navigate(location.pathname, { replace: true });
  }, [location.state, location.pathname, navigate, fetchUsers]);

  const handleUpdateUser = async (updatedUser) => {
    setActionLoading(true);
    setError("");

    try {
      const payload = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        personalEmail: updatedUser.personalEmail,
        status: updatedUser.status,
      };

      await updateUser(updatedUser._id, payload);

      setEditingUser(null);

      if (selectedUser?._id === updatedUser._id) {
        setSelectedUser(null);
      }

      await fetchUsers();
      setSuccess("User updated successfully");
    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.message || "Unable to update user");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };
  const handleDeleteUser = async (userId) => {
    setActionLoading(true);
    setError("");

    try {
      await deleteUser(userId);

      if (selectedUser?._id === userId) {
        setSelectedUser(null);
      }

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchUsers();
      }

      setSuccess("User deactivated successfully");
    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.message || "Unable to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = pagination.totalPages || 1;

  const startIndex = (currentPage - 1) * pagination.limit;

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
            value={pagination.total}
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

        <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--border-light)] bg-[var(--surface)] shadow-md">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]">
                <UsersRound size={18} />
              </div>

              <div className="min-w-0">
                <div>
                  <h2 className="text-base font-semibold">All Users</h2>

                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {pagination.total} users found
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-[var(--border-light)] px-6 py-5">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          {success && (
            <div className="mx-5 mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}
          {error && !loading && (
            <div className="mx-5 mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          <div className="md:block overflow-x-auto ">
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
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
   
    uppercase
    text-xs
font-semibold
tracking-[0.08em]
text-[var(--text-muted)]
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

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-12 text-center text-sm"
                      >
                        Loading users...
                      </td>
                    </tr>
                  )}

                  {error && !loading && users.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-12 text-center text-sm text-red-600"
                      >
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    users.map((user) => (
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
    duration-200
    md:hover:-translate-y-[2px]
    md:hover:shadow-lg
    md:hover:bg-[color-mix(in_srgb,var(--university-blue)_3%,white)]
    border-b
border-[var(--border-light)]
bg-[var(--surface)]
transition-colors
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
    bg-[var(--surface-soft)]
    text-sm
    font-bold
    text-[var(--university-blue)]
  "
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="truncate text-base
font-semibold text-[var(--university-ink)]"
                              >
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
    bg-[var(--surface-soft)]
text-[var(--stratex-blue)]
px-4
py-1.5
    text-xs
    font-semibold
  "
                          >
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-5 sm:py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-4 py-1 gap-1.5 text-xs font-semibold capitalize ${
                              user.status?.toLowerCase() === "active"
                                ? " bg-green-50 text-green-700 ring-1 ring-green-200"
                                : " bg-red-50 text-red-700 ring-1 ring-red-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="relative px-4 py-4 overflow-visible">
                          <button
                            ref={(el) =>
                              (menuButtonRefs.current[user._id] = el)
                            }
                            onClick={(e) => {
                              e.stopPropagation();

                              const rect =
                                menuButtonRefs.current[
                                  user._id
                                ]?.getBoundingClientRect();

                              if (!rect) return;

                              const menuWidth = 208;
                              const menuHeight = 120;

                              let top = rect.bottom + 8;
                              let left = rect.right - menuWidth;

                              if (
                                window.innerHeight - rect.bottom <
                                menuHeight
                              ) {
                                top = rect.top - menuHeight - 8;
                              }

                              if (left < 8) left = 8;

                              setMenuPosition({
                                top,
                                left,
                              });
                              if (openMenu === user._id) {
                                setOpenMenu(null);
                                return;
                              }

                              setOpenMenu(user._id);
                            }}
                            className="
                            menu-trigger
      flex
      h-10
w-10
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
                        </td>
                      </tr>
                    ))}

                  {!loading && !error && users.length === 0 && (
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
              {pagination.total === 0
                ? "Showing 0 users"
                : `Showing ${startIndex + 1} - ${Math.min(
                    startIndex + users.length,
                    pagination.total,
                  )} of ${pagination.total} users`}
            </p>
          </div>
        </div>
      </div>
      {openMenu && (
        <div
          className="fixed floating-user-menu z-[9999]"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <div
            className="
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
              className="
          mx-2
          my-1
          flex
          w-[calc(100%-16px)]
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-sm
          font-medium
          hover:bg-gray-100
        "
              onClick={() => {
                const user = users.find((u) => u._id === openMenu);
                if (!user) return;

                setSelectedUser(null);
                setEditingUser(user);
                setOpenMenu(null);
              }}
            >
              <Pencil size={16} />
              Edit User
            </button>

            <button
              className="
          mx-2
          mt-1
          mb-2
          flex
          w-[calc(100%-16px)]
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-sm
          font-medium
          text-red-600
          hover:bg-red-50
        "
              onClick={() => {
                const user = users.find((u) => u._id === openMenu);
                if (!user) return;

                setSelectedUser(null);
                setDeletingUser(user);
                setOpenMenu(null);
              }}
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>
        </div>
      )}

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
        loading={actionLoading}
      />
      <DeleteUserModal
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onDelete={handleDeleteUser}
        loading={actionLoading}
      />
    </div>
  );
};

export default Users;
