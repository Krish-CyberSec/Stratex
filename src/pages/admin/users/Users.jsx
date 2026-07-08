import {
  getUsers,
  updateUser,
  deleteUser,
} from "../../../services/userService";
import { useState, useEffect, useCallback, useRef } from "react";
import UserDetails from "./components/UserDetails";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import { useLocation, useNavigate } from "react-router-dom";
import Datatable from "../../../components/users/DataTable";
import SearchBar from "../../../components/users/SearchBar";
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
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const userStatToneClass = {
  blue: "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]",
  green:
    "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]",
  amber: "bg-amber-50 text-amber-600",
  action:
    "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]",
};

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
  const [stats, setStats] = useState({
    active: 0,
    faculty: 0,
  });
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [response, activeResponse, facultyResponse] = await Promise.all([
        getUsers({
          page: currentPage,
          limit: USERS_PER_PAGE,
          search: searchTerm.trim() || undefined,
          role: roleFilter === "all" ? undefined : roleFilter,
          sortBy: sortBy === "name" ? "firstName" : "createdAt",
          order: sortBy === "name" ? "asc" : "desc",
        }),
        getUsers({ page: 1, limit: 1, status: "active" }),
        getUsers({ page: 1, limit: 1, role: "faculty" }),
      ]);

      const backendUsers = response.data?.data || [];
      const backendPagination = response.data?.pagination;

      setUsers(backendUsers.map(normalizeUser));
      if (backendPagination) {
        setPagination({
          limit: backendPagination.limit || USERS_PER_PAGE,
          total: backendPagination.total || 0,
          totalPages: backendPagination.totalPages || 1,
        });
      }
      setStats({
        active: activeResponse.data?.pagination?.total ?? 0,
        faculty: facultyResponse.data?.pagination?.total ?? 0,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, sortBy]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
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
    const message = location.state?.message;

    if (!message) return;

    setSuccess(message);
    fetchUsers();
    navigate(location.pathname, { replace: true });
  }, [location.state, location.pathname, navigate, fetchUsers]);

  const handleUpdateUser = async (updatedUser) => {
    setActionLoading(true);
    setError("");

    try {
      const payload = {
        firstName: updatedUser.firstName?.trim(),
        lastName: updatedUser.lastName?.trim(),
        personalEmail: updatedUser.personalEmail?.trim() || undefined,
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
      const message = getErrorMessage(err, "Unable to update user");
      setError(message);
      throw new Error(message, { cause: err });
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
      const message = getErrorMessage(err, "Unable to delete user");
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_48%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
              Users
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
              Manage user profiles, roles, schools, and account access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/users/create")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
          >
            <Plus size={17} />
            Add User
          </button>
        </header>

        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Users",
              value: pagination.total,
              hint: "registered accounts",
              icon: UsersIcon,
              tone: "blue",
            },
            {
              title: "Active Users",
              value: stats.active,
              hint: "ready for access",
              icon: UserCheck,
              tone: "green",
            },
            {
              title: "Faculty Members",
              value: stats.faculty,
              hint: "teaching accounts",
              icon: GraduationCap,
              tone: "amber",
            },
            {
              title: "Create User",
              value: "+",
              hint: "add a new account",
              icon: Plus,
              tone: "action",
              onClick: () => navigate("/dashboard/users/create"),
            },
          ].map((stat) => (
            <button
              key={stat.title}
              type="button"
              onClick={stat.onClick}
              className={`min-h-32 rounded-2xl border border-[var(--border-light)] bg-white p-5 text-left shadow-sm transition ${
                stat.onClick
                  ? "hover:-translate-y-0.5 hover:border-[var(--stratex-blue)] hover:shadow-md"
                  : "cursor-default"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${userStatToneClass[stat.tone]}`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-3xl font-bold leading-none text-[var(--university-ink)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--university-ink)]">
                    {stat.title}
                  </p>
                </div>
              </div>
              <p className="mt-4 pl-[4.5rem] text-xs font-medium text-[var(--university-muted)]">
                {stat.hint}
              </p>
            </button>
          ))}
        </section>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <section className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
          {success && (
            <div className="mx-4 mt-4 rounded-xl border border-[color-mix(in_srgb,var(--success)_24%,white)] bg-[color-mix(in_srgb,var(--success)_10%,white)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
              {success}
            </div>
          )}
          {error && !loading && (
            <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="max-h-[640px] overflow-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)] sm:px-5"
                    >
                      Name
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)] sm:px-5"
                    >
                      Email
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)] sm:px-5"
                    >
                      Role
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)] sm:px-5"
                    >
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-[var(--university-muted)] sm:px-5"
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
    ${openMenu === user._id ? "z-50" : "z-0"}
    duration-200
    border-b
border-[var(--border-light)]
bg-white
transition-colors
md:hover:bg-[var(--surface-soft)]
                  `}
                      >
                        <td className="px-4 py-4 sm:px-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-sm font-bold text-[var(--stratex-blue)]"
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="truncate text-sm font-bold text-[var(--university-ink)]"
                              >
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
                                {user.school}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[var(--university-muted)] sm:px-5">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--university-muted)] sm:px-5">
                          <span className="inline-flex rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_9%,white)] px-3 py-1 text-xs font-bold text-[var(--stratex-blue)]">
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-4 sm:px-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              user.status?.toLowerCase() === "active"
                                ? "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]"
                                : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="relative overflow-visible px-4 py-4 sm:px-5">
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
                            className="menu-trigger inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--university-ink)]"
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
          <div className="border-t border-[var(--border-light)] px-4 py-4">
            <Datatable
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              itemCount={users.length}
              itemLabel="users"
            />
          </div>
        </section>
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
