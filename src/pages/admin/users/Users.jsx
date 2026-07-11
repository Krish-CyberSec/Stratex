import {
  getUsers,
  updateUser,
  deleteUser,
} from "../../../services/userService";
import { useState, useEffect, useCallback } from "react";
import UserDetails from "./components/UserDetails";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import { useLocation, useNavigate } from "react-router-dom";
import Datatable from "../../../components/users/DataTable";
import SearchBar from "../../../components/users/SearchBar";
import styled from "styled-components";
import {
  ArrowRight,
  Building2,
  Pencil,
  Plus,
  Shield,
  Trash2,
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
const formatRoles = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles].filter(Boolean);
  return roleList.map(formatRole).join(", ");
};
const normalizeUser = (user) => {
  const roles = user.roles?.length ? user.roles : [user.role || "student"];

  return {
    ...user,
    roles,
    role: roles[0],
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
const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid transparent;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: all 160ms ease;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const PrimaryButton = styled(ActionButton)`
  background: var(--university-blue);
  color: white;

  &:hover {
    background: var(--university-blue-dark);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: white;
  color: var(--text-primary);
  border-color: var(--university-border);

  &:hover {
    background: var(--background);
  }
`;

const DangerButton = styled(ActionButton)`
  background: #dc2626;
  color: white;

  &:hover {
    background: #b91c1c;
  }
`;

const IconButton = styled(SecondaryButton)`
  width: 38px;
  height: 38px;
  padding: 0;
`;

const DangerIconButton = styled(DangerButton)`
  width: 38px;
  height: 38px;
  padding: 0;
`;
const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
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
    setSuccess("");

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
  const handleRefresh = async () => {
    if (loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    await fetchUsers();
  };
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
  const statusClass = (status) =>
    status?.toLowerCase() === "active"
      ? "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]"
      : "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]";

  const handleEditClick = (user) => {
    setSelectedUser(null);
    setEditingUser(user);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(null);
    setDeletingUser(user);
  };

  const renderEmptyState = () => (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white px-5 py-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)]">
        <UsersRound size={22} />
      </div>
      <p className="text-sm font-bold text-[var(--university-ink)]">
        No users found
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--university-muted)]">
        Try changing your search term or create a new user.
      </p>
    </div>
  );

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

          <PrimaryButton
            type="button"
            onClick={() => navigate("/dashboard/users/create")}
          >
            <Plus size={17} />
            Add User
          </PrimaryButton>
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
                  ? "cursor-pointer hover:-translate-y-0.5 hover:border-[var(--stratex-blue)] hover:shadow-md"
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
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={handleRefresh}
          loading={loading}
        />

        <section className="space-y-4">
          {success && (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--success)_24%,white)] bg-[color-mix(in_srgb,var(--success)_10%,white)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
              {success}
            </div>
          )}
          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          )}

          {loading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                  : "grid gap-3"
              }
            >
              {Array.from({ length: USERS_PER_PAGE }).map((_, index) => (
                <div
                  key={index}
                  className="min-h-[180px] animate-pulse rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-[var(--surface-hover)]" />
                  <div className="mt-5 h-4 w-3/4 rounded bg-[var(--surface-hover)]" />
                  <div className="mt-3 h-3 w-full rounded bg-[var(--surface-hover)]" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-[var(--surface-hover)]" />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && users.length === 0 && renderEmptyState()}

          {!loading && users.length > 0 && viewMode === "grid" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {users.map((user) => (
                <article
                  key={user._id}
                  className="flex min-h-[248px] flex-col rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--university-blue)_28%,white)] hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-sm font-bold text-[var(--stratex-blue)]">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusClass(user.status)}`}
                    >
                      {user.status || "Unknown"}
                    </span>
                  </div>

                  <div className="mt-4 min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[var(--university-ink)]">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="mt-2 break-all text-xs font-medium leading-5 text-[var(--text-secondary)]">
                      {user.email}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 border-t border-[var(--border-light)] pt-3">
                    <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
                      <Shield size={15} className="shrink-0" />
                      <span>{formatRoles(user.roles)}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
                      <Building2 size={15} className="shrink-0" />
                      <span className="truncate">{user.school}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[var(--border-light)] pt-3 sm:grid-cols-3">
                    <PrimaryButton
                      type="button"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                      <ArrowRight size={14} />
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil size={14} />
                    </SecondaryButton>
                    <DangerButton
                      type="button"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Trash2 size={14} />
                    </DangerButton>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && users.length > 0 && viewMode === "list" && (
            <div className="grid gap-3">
              {users.map((user) => (
                <article
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition cursor-pointer hover:border-[color-mix(in_srgb,var(--university-blue)_28%,white)] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-base font-bold text-[var(--stratex-blue)]">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-[var(--university-ink)]">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="mt-1 max-w-full truncate text-sm text-[var(--text-secondary)]">
                        {user.email}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 overflow-hidden">
                        <span className="rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_9%,white)] px-2.5 py-1 text-[11px] font-bold text-[var(--stratex-blue)]">
                          {formatRoles(user.roles)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(user.status)}`}
                        >
                          {user.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex w-full flex-wrap items-center gap-2 sm:ml-4 sm:w-auto sm:justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-bold text-[var(--university-muted)]">
                      <Building2 size={14} />
                      <span className="max-w-[180px] truncate sm:max-w-[220px]">
                        {user.school}
                      </span>
                    </span>

                    <IconButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(user);
                      }}
                    >
                      <Pencil size={14} />
                    </IconButton>
                    <DangerIconButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user);
                      }}
                    >
                      <Trash2 size={14} />
                    </DangerIconButton>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="rounded-2xl border border-[var(--border-light)] bg-white px-4 py-4 shadow-sm">
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
          )}
        </section>
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
