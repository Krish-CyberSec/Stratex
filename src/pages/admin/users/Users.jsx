import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Download,
  Eye,
  FileUp,
  Grid2X2,
  HelpCircle,
  History,
  List,
  Plus,
  RefreshCw,
  Shield,
  UserCog,
  Users as UsersIcon,
  UsersRound,
} from "lucide-react";
import styled from "styled-components";

import { getPrograms } from "../../../services/programService";
import { getSchools } from "../../../services/schoolService";
import { getSpecializations } from "../../../services/specializationService";
import axiosInstance from "../../../utils/axiosInstance";
import {
  deleteUser,
  getUsers,
  updateUser,
} from "../../../services/userService";
import Datatable from "../../../components/users/DataTable";
import SearchBar from "../../../components/users/SearchBar";
import DeleteUserModal from "./components/DeleteUserModal";
import UserDetails from "./components/UserDetails";

const USERS_PER_PAGE = 10;

const roleOptions = [
  { value: "student", label: "Students", color: "#22c55e" },
  { value: "faculty", label: "Faculty", color: "#2563eb" },
  { value: "coordinator", label: "Coordinators", color: "#8b5cf6" },
  { value: "schoolAdmin", label: "School Admins", color: "#f59e0b" },
  { value: "examCell", label: "Exam Cell", color: "#ef4444" },
];

const roleLabelMap = {
  ...roleOptions.reduce((acc, role) => {
    acc[role.value] = role.label.replace(/s$/, "");
    return acc;
  }, {}),
  superAdmin: "Super Admin",
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const sortOptions = [
  { value: "firstName", label: "Name" },
  { value: "createdAt", label: "Created At" },
  { value: "updatedAt", label: "Updated At" },
  { value: "lastLogin", label: "Last Login" },
  { value: "status", label: "Status" },
];

const defaultFilters = {
  search: "",
  role: "all",
  schoolId: "all",
  programId: "all",
  specializationId: "all",
  semesterId: "all",
  status: "all",
  sortBy: "createdAt",
  order: "desc",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const unwrapList = (response) =>
  response?.data?.data ||
  response?.data?.schools ||
  response?.data?.programs ||
  response?.data?.specializations ||
  response?.data ||
  [];

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";

const formatRole = (role) => roleLabelMap[role] || role || "User";

const formatRoles = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles].filter(Boolean);
  return roleList.map(formatRole).join(", ") || "User";
};

const formatDate = (date) => {
  if (!date) return "Never";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getPrimaryAssignment = (user) =>
  user?.academicAssignments?.find((assignment) => assignment.isPrimary) ||
  user?.academicAssignments?.[0] ||
  null;

const getId = (value) =>
  typeof value === "object" && value !== null ? value._id || value.id : value;

const getName = (value, fallback = "Not Assigned") =>
  typeof value === "object" && value !== null
    ? value.name || fallback
    : value || fallback;

const getSemesterLabel = (semester) => {
  if (!semester) return "Not Assigned";
  if (typeof semester === "object") {
    return semester.name || `Semester ${semester.semesterNumber || ""}`.trim();
  }
  return semester;
};

const normalizeUser = (user) => {
  const roles = user.roles?.length ? user.roles : [user.role || "student"];
  const assignment = getPrimaryAssignment(user);

  return {
    ...user,
    roles,
    role: roles[0],
    email:
      user.universityAccount?.universityEmail ||
      user.personalEmail ||
      user.email ||
      "No email",
    school:
      user.schoolId?.name || user.school?.name || user.school || "Not Assigned",
    assignment,
  };
};

const statusClass = (status) => {
  const normalized = status?.toLowerCase();

  if (normalized === "active") {
    return "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]";
  }

  if (normalized === "suspended") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]";
};

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 160ms ease;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
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

const IconButton = styled(SecondaryButton)`
  width: 38px;
  padding: 0;
`;

const buildQuery = (filters, currentPage) => ({
  page: currentPage,
  limit: USERS_PER_PAGE,
  search: filters.search.trim() || undefined,
  role: filters.role === "all" ? undefined : filters.role,
  schoolId: filters.schoolId === "all" ? undefined : filters.schoolId,
  programId: filters.programId === "all" ? undefined : filters.programId,
  specializationId:
    filters.specializationId === "all" ? undefined : filters.specializationId,
  semesterId: filters.semesterId === "all" ? undefined : filters.semesterId,
  status: filters.status === "all" ? undefined : filters.status,
  sortBy: filters.sortBy,
  order: filters.order,
});

const UserAvatar = ({ user }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_12%,white)] text-xs font-black text-[var(--stratex-blue)]">
    {getInitials(user.firstName, user.lastName)}
  </div>
);

const RoleBadges = ({ roles }) => (
  <div className="flex flex-wrap gap-1.5">
    {(Array.isArray(roles) ? roles : [roles].filter(Boolean)).map((role) => (
      <span
        key={role}
        className="rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_9%,white)] px-2 py-1 text-[10px] font-black text-[var(--stratex-blue)]"
      >
        {formatRole(role)}
      </span>
    ))}
  </div>
);

const AcademicAssignment = ({ assignment }) => {
  if (!assignment) {
    return (
      <span className="text-xs font-semibold text-[var(--university-muted)]">
        --
      </span>
    );
  }

  const lines = [
    getName(assignment.programId, ""),
    getSemesterLabel(assignment.semesterId),
    getName(assignment.specializationId, ""),
  ].filter(Boolean);

  return (
    <div className="min-w-0 text-xs leading-5">
      <p className="truncate font-black text-[var(--university-ink)]">
        {lines[0]}
      </p>
      {lines.slice(1).map((line) => (
        <p
          key={line}
          className="truncate font-semibold text-[var(--university-muted)]"
        >
          {line}
        </p>
      ))}
    </div>
  );
};

const UsersTable = ({ users, onView }) => (
  <section className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
    <div className="border-b border-[var(--border-light)] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-black text-[var(--university-ink)]">
            Users
          </h2>
        </div>
      </div>
    </div>

    <div className="hidden min-w-0 grid-cols-[minmax(210px,1.4fr)_minmax(135px,0.8fr)_minmax(150px,0.9fr)_minmax(190px,1fr)_100px_110px_70px] gap-3 border-b border-[var(--border-light)] bg-[var(--surface-soft)] px-5 py-3 text-[11px] font-black uppercase text-[var(--university-muted)] xl:grid">
      <span>User</span>
      <span>Role(s)</span>
      <span>School</span>
      <span>Academic Assignment</span>
      <span>Status</span>
      <span>Last Login</span>
      <span className="text-right">Actions</span>
    </div>

    <div className="divide-y divide-[var(--border-light)]">
      {users.map((user) => (
        <article
          key={user._id}
          className="grid gap-4 px-4 py-4 transition hover:bg-[var(--surface-soft)] sm:px-5 xl:grid-cols-[minmax(210px,1.4fr)_minmax(135px,0.8fr)_minmax(150px,0.9fr)_minmax(190px,1fr)_100px_110px_70px] xl:items-center xl:gap-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[var(--university-ink)]">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  "Unnamed User"}
              </p>
              <p className="truncate text-xs font-semibold text-[var(--university-muted)]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="xl:hidden">
            <RoleBadges roles={user.roles} />
          </div>
          <div className="hidden xl:block">
            <RoleBadges roles={user.roles} />
          </div>

          <div className="min-w-0 text-xs font-bold text-[var(--university-muted)]">
            <span className="xl:hidden">School: </span>
            <span className="truncate xl:block">{user.school}</span>
          </div>

          <AcademicAssignment assignment={user.assignment} />

          <span
            className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-black capitalize ${statusClass(
              user.status,
            )}`}
          >
            {user.status || "Unknown"}
          </span>

          <p className="text-xs font-bold text-[var(--university-muted)]">
            <span className="xl:hidden">Last login: </span>
            {formatDate(user.lastLogin)}
          </p>

          <div className="flex justify-start xl:justify-end">
            <IconButton
              type="button"
              onClick={() => onView(user)}
              aria-label={`View ${user.firstName || "user"}`}
              title="View user"
            >
              <Eye size={16} />
            </IconButton>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const UserGrid = ({ users, onView }) => (
  <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
    {users.map((user) => (
      <article
        key={user._id}
        className="flex min-h-[250px] flex-col rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--university-blue)_26%,white)] hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-[var(--university-ink)]">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  "Unnamed User"}
              </h3>
              <p className="mt-1 truncate text-xs font-semibold text-[var(--university-muted)]">
                {user.email}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black capitalize ${statusClass(
              user.status,
            )}`}
          >
            {user.status || "Unknown"}
          </span>
        </div>

        <div className="mt-4">
          <RoleBadges roles={user.roles} />
        </div>

        <div className="mt-4 grid flex-1 gap-3 border-t border-[var(--border-light)] pt-4">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-[var(--university-muted)]">
              School
            </p>
            <p className="mt-1 truncate text-xs font-bold text-[var(--university-ink)]">
              {user.school}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-[var(--university-muted)]">
              Academic Assignment
            </p>
            <div className="mt-1">
              <AcademicAssignment assignment={user.assignment} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase text-[var(--university-muted)]">
              Last Login
            </p>
            <p className="mt-1 text-xs font-bold text-[var(--university-ink)]">
              {formatDate(user.lastLogin)}
            </p>
          </div>
        </div>

        <PrimaryButton
          type="button"
          className="mt-4 w-full"
          onClick={() => onView(user)}
        >
          <Eye size={15} />
          View User
        </PrimaryButton>
      </article>
    ))}
  </section>
);

const ViewModeToggle = ({ value, onChange }) => (
  <div className="flex rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-1">
    <button
      type="button"
      onClick={() => onChange("list")}
      aria-pressed={value === "list"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
        value === "list"
          ? "bg-white text-[var(--stratex-blue)] shadow-sm"
          : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
      }`}
      title="List view"
    >
      <List size={17} />
    </button>
    <button
      type="button"
      onClick={() => onChange("grid")}
      aria-pressed={value === "grid"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
        value === "grid"
          ? "bg-white text-[var(--stratex-blue)] shadow-sm"
          : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
      }`}
      title="Grid view"
    >
      <Grid2X2 size={17} />
    </button>
  </div>
);

const StatLine = ({ label, value, tone = "text-[var(--stratex-blue)]" }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="font-bold text-[var(--university-muted)]">{label}</span>
    <span className={`font-black ${tone}`}>{value}</span>
  </div>
);

const DonutChart = ({ roleStats, total }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const segments = roleStats.reduce(
    (acc, item) => {
      const length = total ? (item.count / total) * circumference : 0;
      acc.items.push({ ...item, length, offset: acc.offset });
      acc.offset -= length;
      return acc;
    },
    { items: [], offset: 25 },
  ).items;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 90 90" className="h-28 w-28 shrink-0 -rotate-90">
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="var(--surface-soft)"
          strokeWidth="12"
        />
        {segments.map((item) => (
          <circle
            key={item.value}
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth="12"
            strokeDasharray={`${item.length} ${circumference - item.length}`}
            strokeDashoffset={item.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div className="min-w-0 flex-1 space-y-2">
        {roleStats.map((item) => (
          <div
            key={item.value}
            className="flex min-w-0 items-center gap-2 text-[11px]"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-0 flex-1 truncate font-bold text-[var(--university-muted)]">
              {item.label}
            </span>
            <span className="font-black text-[var(--university-ink)]">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SidebarCard = ({ icon: Icon, title, children }) => (
  <section className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <h3 className="flex items-center gap-2 text-sm font-black text-[var(--university-ink)]">
      <Icon size={17} className="text-[var(--stratex-blue)]" />
      {title}
    </h3>
    <div className="mt-4">{children}</div>
  </section>
);

const QuickAction = ({ icon: Icon, label, description, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-55"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
      <Icon size={16} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-xs font-black text-[var(--university-ink)]">
        {label}
      </span>
      <span className="block truncate text-[11px] font-semibold text-[var(--university-muted)]">
        {description}
      </span>
    </span>
    <ArrowRight size={14} className="shrink-0 text-[var(--university-muted)]" />
  </button>
);

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState("list");
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [pagination, setPagination] = useState({
    limit: USERS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    roles: roleOptions.map((role) => ({ ...role, count: 0 })),
  });

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(([key, value]) => {
        if (key === "sortBy") return value !== defaultFilters.sortBy;
        if (key === "order") return value !== defaultFilters.order;
        if (key === "search") return value.trim() !== "";
        return value !== "all";
      }).length,
    [filters],
  );

  const roleChartTotal = useMemo(
    () => stats.roles.reduce((total, role) => total + role.count, 0),
    [stats.roles],
  );

  const fetchOptions = useCallback(async () => {
    setOptionsLoading(true);

    try {
      const schoolFilter =
        filters.schoolId === "all" ? undefined : filters.schoolId;
      const programFilter =
        filters.programId === "all" ? undefined : filters.programId;

      const [
        schoolResponse,
        programResponse,
        specializationResponse,
        semesterResponse,
      ] = await Promise.all([
        getSchools({
          page: 1,
          limit: 100,
          status: "active",
          sortBy: "name",
          order: "asc",
        }),
        getPrograms({
          page: 1,
          limit: 100,
          schoolId: schoolFilter,
          status: "active",
          sortBy: "name",
          order: "asc",
        }),
        getSpecializations({
          page: 1,
          limit: 100,
          programId: programFilter,
          status: "active",
          sortBy: "name",
          order: "asc",
        }),
        axiosInstance.get("/semesters", {
          params: {
            page: 1,
            limit: 100,
            status: "active",
            sortBy: "semesterNumber",
            order: "asc",
          },
        }),
      ]);

      const semesters = unwrapList(semesterResponse).map((semester) => ({
        value: semester._id || semester.id,
        label:
          semester.name || `Semester ${semester.semesterNumber || ""}`.trim(),
      }));

      setSchools(unwrapList(schoolResponse));
      setPrograms(unwrapList(programResponse));
      setSpecializations(unwrapList(specializationResponse));
      setSemesterOptions(semesters);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load filter options"));
    } finally {
      setOptionsLoading(false);
    }
  }, [filters.schoolId, filters.programId]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const query = buildQuery(filters, currentPage);
      const roleRequests = roleOptions.map((role) =>
        getUsers({ page: 1, limit: 1, role: role.value }),
      );
      const [
        response,
        totalResponse,
        activeResponse,
        inactiveResponse,
        suspendedResponse,
        ...roleResponses
      ] = await Promise.all([
        getUsers(query),
        getUsers({ page: 1, limit: 1 }),
        getUsers({ page: 1, limit: 1, status: "active" }),
        getUsers({ page: 1, limit: 1, status: "inactive" }),
        getUsers({ page: 1, limit: 1, status: "suspended" }),
        ...roleRequests,
      ]);

      const backendUsers = response.data?.data || [];
      const backendPagination = response.data?.pagination;

      setUsers(backendUsers.map(normalizeUser));
      setPagination({
        limit: backendPagination?.limit || USERS_PER_PAGE,
        total: backendPagination?.total || 0,
        totalPages: backendPagination?.totalPages || 1,
      });
      setStats({
        total: totalResponse.data?.pagination?.total ?? 0,
        active: activeResponse.data?.pagination?.total ?? 0,
        inactive: inactiveResponse.data?.pagination?.total ?? 0,
        suspended: suspendedResponse.data?.pagination?.total ?? 0,
        roles: roleOptions.map((role, index) => ({
          ...role,
          count: roleResponses[index]?.data?.pagination?.total ?? 0,
        })),
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return undefined;

    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const message = location.state?.message;

    if (!message) return;

    setSuccess(message);
    fetchUsers();
    navigate(location.pathname, { replace: true });
  }, [fetchUsers, location.pathname, location.state, navigate]);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters((prev) => {
      const updated = { ...nextFilters };

      if (updated.schoolId !== prev.schoolId) {
        updated.programId = "all";
        updated.specializationId = "all";
      } else if (updated.programId !== prev.programId) {
        updated.specializationId = "all";
      }

      return updated;
    });
  }, []);

  const handleOpenUserDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
  };

  const handleRefresh = useCallback(() => {
    if (!loading) fetchUsers();
  }, [fetchUsers, loading]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleRoleTab = useCallback((role) => {
    setFilters((prev) => ({ ...prev, role }));
  }, []);

  const handleExport = useCallback(() => {
    const headers = [
      "Name",
      "Email",
      "Roles",
      "School",
      "Status",
      "Last Login",
    ];
    const rows = users.map((user) => [
      [user.firstName, user.lastName].filter(Boolean).join(" "),
      user.email,
      formatRoles(user.roles),
      user.school,
      user.status || "",
      formatDate(user.lastLogin),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [users]);

  const handleUpdateUser = async (updatedUser) => {
    setError("");

    try {
      const payload = {
        firstName: updatedUser.firstName?.trim(),
        lastName: updatedUser.lastName?.trim(),
        personalEmail: updatedUser.personalEmail?.trim() || undefined,
      };

      if (["active", "inactive"].includes(updatedUser.status)) {
        payload.status = updatedUser.status;
      }

      if (Array.isArray(updatedUser.academicAssignments)) {
        payload.academicAssignments = updatedUser.academicAssignments;
      }

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
    }
  };

  const handleDeleteUser = async (userId) => {
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
    }
  };

  const renderEmptyState = () => (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white px-5 py-14 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)]">
        <UsersRound size={22} />
      </div>
      <p className="text-sm font-black text-[var(--university-ink)]">
        No users found
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--university-muted)]">
        Try changing filters or create a new user.
      </p>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_50%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-black leading-tight text-[var(--text-primary)] sm:text-3xl">
              Users
            </h1>
            <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-secondary)]">
              Manage all users in the university system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrimaryButton
              type="button"
              onClick={() => navigate("/dashboard/users/create")}
            >
              <Plus size={16} />
              Add New User
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={handleExport}
              disabled={!users.length}
            >
              <Download size={16} />
              Export This Page
            </SecondaryButton>

            <IconButton
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </IconButton>
          </div>
        </header>

        <SearchBar
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleReset}
          roleOptions={roleOptions}
          schoolOptions={schools}
          programOptions={programs}
          specializationOptions={specializations}
          semesterOptions={semesterOptions}
          statusOptions={statusOptions}
          sortOptions={sortOptions}
          loading={loading || optionsLoading}
          activeFilterCount={activeFilterCount}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-light)] bg-white p-2 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleRoleTab("all")}
              className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                filters.role === "all"
                  ? "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]"
                  : "text-[var(--university-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--university-ink)]"
              }`}
            >
              All Users
            </button>
            {roleOptions.map((role) => (
              <button
                type="button"
                key={role.value}
                onClick={() => handleRoleTab(role.value)}
                className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                  filters.role === role.value
                    ? "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]"
                    : "text-[var(--university-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--university-ink)]"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
        </div>

        {success && (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--success)_24%,white)] bg-[color-mix(in_srgb,var(--success)_10%,white)] px-4 py-3 text-sm font-bold text-[var(--success)]">
            {success}
          </div>
        )}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-[var(--error)]">
            {error}
          </div>
        )}

        <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            {loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                    : "rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm"
                }
              >
                {Array.from({ length: USERS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    className={`animate-pulse rounded-xl bg-[var(--surface-soft)] ${
                      viewMode === "grid"
                        ? "h-64 border border-[var(--border-light)] bg-white"
                        : "mb-3 h-16 last:mb-0"
                    }`}
                  />
                ))}
              </div>
            )}

            {!loading && !error && users.length === 0 && renderEmptyState()}

            {!loading && users.length > 0 && (
              <>
                {viewMode === "grid" ? (
                  <UserGrid users={users} onView={setSelectedUser} />
                ) : (
                  <UsersTable users={users} onView={setSelectedUser} />
                )}
                <div className="rounded-2xl border border-[var(--border-light)] bg-white px-4 py-4 shadow-sm">
                  <Datatable
                    currentPage={currentPage}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={setCurrentPage}
                    totalItems={pagination.total}
                    pageSize={pagination.limit}
                    itemCount={users.length}
                    itemLabel="users"
                  />
                </div>
              </>
            )}
          </div>

          <aside className="space-y-4">
            <SidebarCard icon={BarChart3} title="User Overview">
              <div className="space-y-3">
                <StatLine label="Total Users" value={stats.total} />
                <StatLine
                  label="Active Users"
                  value={stats.active}
                  tone="text-[var(--success)]"
                />
                <StatLine
                  label="Inactive Users"
                  value={stats.inactive}
                  tone="text-amber-700"
                />
                <StatLine
                  label="Suspended Users"
                  value={stats.suspended}
                  tone="text-[var(--error)]"
                />
              </div>
            </SidebarCard>

            <SidebarCard icon={UsersIcon} title="Users by Role">
              <DonutChart roleStats={stats.roles} total={roleChartTotal} />
            </SidebarCard>

            <SidebarCard icon={UserCog} title="Quick Actions">
              <div className="space-y-1">
                <QuickAction
                  icon={Plus}
                  label="Add User"
                  description="Create a new user account"
                  onClick={() => navigate("/dashboard/users/create")}
                />
                <QuickAction
                  icon={FileUp}
                  label="Import Users"
                  description="Bulk import is not configured"
                  disabled
                />
                <QuickAction
                  icon={Download}
                  label="Export Users"
                  description="Download this page of results"
                  onClick={handleExport}
                  disabled={!users.length}
                />
                <QuickAction
                  icon={Shield}
                  label="Manage Roles"
                  description="Roles are controlled by user profiles"
                  disabled
                />
                <QuickAction
                  icon={History}
                  label="Activity Logs"
                  description="Audit logs are not configured"
                  disabled
                />
              </div>
            </SidebarCard>

            <SidebarCard icon={HelpCircle} title="Help & Support">
              <div className="rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="text-sm font-black text-[var(--university-ink)]">
                  Need help managing users?
                </p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[var(--university-muted)]">
                  Visit the support page for account and access guidance.
                </p>
                <PrimaryButton
                  type="button"
                  className="mt-4 w-full"
                  onClick={() => navigate("/support")}
                >
                  Visit Help Center
                  <ArrowRight size={14} />
                </PrimaryButton>
              </div>
            </SidebarCard>
          </aside>
        </main>
      </div>

      <UserDetails
        isOpen={Boolean(selectedUser)}
        user={selectedUser}
        onClose={handleCloseUserDetails}
        onEdit={handleUpdateUser}
        onDelete={setDeletingUser}
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
