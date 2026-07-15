import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Award,
  Book,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  KeyRound,
  Loader2,
  Mail,
  Pencil,
  Save,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

const cardClass =
  "rounded-xl border border-[#dfe7f3] bg-white shadow-[0_8px_24px_rgba(20,38,74,0.06)]";
const fieldClass =
  "h-11 w-full rounded-lg border border-[#cfdced] bg-white px-3 text-sm font-medium text-[#14264a] outline-none transition placeholder:text-[#7b8aa5] focus:border-[#2563eb] focus:ring-3 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
const labelClass = "mb-2 block text-xs font-bold text-[#14264a]";

const roleCatalog = [
  {
    value: "student",
    label: "Student",
    tone: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    value: "faculty",
    label: "Faculty",
    tone: "text-green-600 bg-green-50 border-green-100",
  },
  {
    value: "coordinator",
    label: "Coordinator",
    tone: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    value: "schoolAdmin",
    label: "School Admin",
    tone: "text-orange-600 bg-orange-50 border-orange-100",
  },
  {
    value: "examCell",
    label: "Exam Cell",
    tone: "text-cyan-600 bg-cyan-50 border-cyan-100",
  },
  {
    value: "superAdmin",
    label: "Super Admin",
    tone: "text-red-600 bg-red-50 border-red-100",
  },
];

const quickActions = [
  { label: "View Program Details", icon: BookOpen },
  { label: "View Timetable", icon: CalendarDays },
  { label: "View Attendance", icon: CheckCircle2 },
  { label: "View Grades", icon: Award },
  { label: "View Exam Results", icon: Book },
];

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

const getInitials = (user) => {
  const first = user?.firstName?.[0];
  const last = user?.lastName?.[0];
  return [first, last].filter(Boolean).join("") || user?.email?.[0] || "?";
};

const formatDisplayValue = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "") return fallback;
  if (Array.isArray(value)) {
    return value.filter(Boolean).length
      ? value.filter(Boolean).join(", ")
      : fallback;
  }
  if (typeof value === "object") {
    return value.name || value.label || value.title || fallback;
  }
  return String(value);
};

const formatDate = (value, fallback = "—") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value, fallback = "—") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatSemester = (semester) => {
  if (semester === null || semester === undefined || semester === "")
    return "—";
  if (typeof semester === "object") {
    if (semester.semesterNumber) return `Semester ${semester.semesterNumber}`;
    return semester.name || semester.label || "—";
  }
  return Number.isFinite(Number(semester))
    ? `Semester ${semester}`
    : String(semester);
};

const formatSubjects = (subjects) => {
  if (!Array.isArray(subjects) || subjects.length === 0)
    return "Not Applicable";
  return subjects
    .map((subject) =>
      typeof subject === "string"
        ? subject
        : subject?.name || subject?.title || subject?.code || "Subject",
    )
    .join(", ");
};

const buildInitialForm = (user = {}) => ({
  firstName: user?.firstName || "",
  middleName: user?.middleName || "",
  lastName: user?.lastName || "",
  gender: user?.gender || "",
  dob: user?.dob || user?.dateOfBirth || "",
  personalEmail: user?.personalEmail || user?.personalEmailAddress || "",
  email: user?.email || "",
  address: user?.address || user?.permanentAddress || "",
  status: user?.status || "Active",
});

const normalizeUser = (rawUser = {}) => {
  if (!rawUser || typeof rawUser !== "object") return {};

  const name =
    rawUser.fullName ||
    rawUser.name ||
    [rawUser.firstName, rawUser.lastName].filter(Boolean).join(" ").trim();

  const firstName =
    rawUser.firstName || rawUser.first_name || name?.split(" ")[0] || "";
  const lastName =
    rawUser.lastName ||
    rawUser.last_name ||
    name?.split(" ").slice(1).join(" ") ||
    "";

  return {
    ...rawUser,
    _id: rawUser._id || rawUser.id,
    id: rawUser._id || rawUser.id,
    firstName,
    lastName,
    email: rawUser.email || rawUser.universityEmail || "",
    status: rawUser.status || "Active",
    roles: Array.isArray(rawUser.roles)
      ? rawUser.roles
      : rawUser.role
        ? [rawUser.role]
        : [],
    role: rawUser.role || rawUser.roles?.[0] || "",
    academicAssignments: Array.isArray(rawUser.academicAssignments)
      ? rawUser.academicAssignments
      : [],
    profileImage: rawUser.profileImage || rawUser.avatar || "",
  };
};

const CardHeader = ({ icon: Icon, title, action }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-2.5">
      <Icon size={18} className="text-blue-600" />
      <h2 className="text-base font-extrabold text-[#14264a]">{title}</h2>
    </div>
    {action}
  </div>
);

const DetailField = ({ label, value, isEditing, editor, className = "" }) => (
  <div className={className}>
    <p className={labelClass}>{label}</p>
    {isEditing ? (
      editor
    ) : (
      <p className="break-words text-sm font-bold text-[#14264a]">{value}</p>
    )}
  </div>
);

const StatRow = ({ label, value, valueClassName = "text-[#14264a]" }) => (
  <div className="flex items-center py-2.5 text-sm">
    <span className="w-40 shrink-0 font-semibold text-[#53657f]">{label}</span>

    <span className={`flex-1 text-right font-bold ${valueClassName}`}>
      {value}
    </span>
  </div>
);

const Pill = ({
  children,
  tone = "text-[#53657f] bg-[#f1f5fb] border-[#e5edf7]",
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tone}`}
  >
    {children}
  </span>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="mt-4 rounded-xl border border-dashed border-[#b8c9df] bg-[#f9fbfe] px-4 py-10 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
      <Icon size={24} />
    </div>
    <p className="mt-4 text-sm font-extrabold text-[#14264a]">{title}</p>
    {description && (
      <p className="mx-auto mt-2 max-w-64 text-xs font-semibold leading-5 text-[#53657f]">
        {description}
      </p>
    )}
  </div>
);

const UserDetails = ({
  user,
  selectedUser,
  selectedUserData,
  loading = false,
  isOpen = true,
  visible = true,
  onClose,
  onCloseModal,
  onEdit,
  onSave,
  onDelete,
  onDeleteUser,
}) => {
  const dialogRef = useRef(null);

  const rawUser = user ?? selectedUser ?? selectedUserData ?? null;
  const resolvedUser = normalizeUser(rawUser);
  const resolvedOnClose = onClose ?? onCloseModal;
  const resolvedOnEdit = onEdit ?? onSave;
  const resolvedOnDelete = onDelete ?? onDeleteUser;

  const [currentUser, setCurrentUser] = useState(resolvedUser);
  const [draft, setDraft] = useState(() => buildInitialForm(resolvedUser));
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const normalized = normalizeUser(rawUser);
    setCurrentUser(normalized);
    setDraft(buildInitialForm(normalized));
    setIsEditing(false);
    setActiveTab("overview");
    setStatusMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawUser]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        resolvedOnClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [resolvedOnClose]);

  const fullName = useMemo(
    () =>
      `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
    [currentUser],
  );

  const isActive = (currentUser?.status || "").toLowerCase() === "active";

  const primaryRoleLabel = useMemo(
    () => formatRole(currentUser?.roles?.[0] || currentUser?.role || ""),
    [currentUser],
  );

  const schoolName = useMemo(
    () =>
      currentUser?.school?.name ||
      currentUser?.school ||
      currentUser?.institution?.name ||
      "Not Assigned",
    [currentUser],
  );

  const universityEmail = useMemo(
    () =>
      currentUser?.universityAccount?.email ||
      currentUser?.universityEmail ||
      currentUser?.email ||
      "Not provided",
    [currentUser],
  );

  const institutionId = useMemo(
    () =>
      currentUser?.universityAccount?.id ||
      currentUser?.institutionId ||
      currentUser?.studentId ||
      currentUser?.employeeId ||
      currentUser?.universityAccount?.studentId ||
      "Not assigned",
    [currentUser],
  );

  const academicAssignments = useMemo(() => {
    if (!Array.isArray(currentUser?.academicAssignments)) return [];
    return currentUser.academicAssignments;
  }, [currentUser]);

  const primaryAssignment = useMemo(
    () =>
      academicAssignments.find((assignment) => assignment?.isPrimary) ||
      academicAssignments[0] ||
      {},
    [academicAssignments],
  );

  const programName = formatDisplayValue(
    currentUser?.program ||
      primaryAssignment?.program ||
      primaryAssignment?.programId,
  );
  const specializationName = formatDisplayValue(
    currentUser?.specialization ||
      primaryAssignment?.specialization ||
      primaryAssignment?.specializationId,
    "No specialization",
  );
  const academicYear = formatDisplayValue(
    currentUser?.academicYear || primaryAssignment?.academicYear,
  );
  const semesterLabel =
    formatSemester(
      currentUser?.semester ||
        primaryAssignment?.semester ||
        primaryAssignment?.semesterId,
    ) || "—";

  const handleChange = (field, value) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        ...currentUser,
        ...draft,
        _id: currentUser?._id || currentUser?.id,
        id: currentUser?._id || currentUser?.id,
      };

      if (typeof resolvedOnEdit === "function") {
        await Promise.resolve(resolvedOnEdit(payload));
      }

      setCurrentUser(payload);
      setIsEditing(false);
      setStatusMessage({ type: "success", text: "User updated successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error?.message || "Unable to update user right now.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(buildInitialForm(currentUser));
    setIsEditing(false);
    setStatusMessage(null);
  };

  const handleDelete = () => {
    if (typeof resolvedOnDelete === "function") {
      resolvedOnDelete(currentUser);
    }
  };

  if (!isOpen && !visible) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
        <div className={`${cardClass} w-full max-w-sm p-6`}>
          <div className="flex items-center gap-3 text-[#14264a]">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <span className="text-sm font-bold">Loading user profile…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!resolvedUser || Object.keys(resolvedUser).length === 0) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "assignments", label: "Academic Assignments" },
    { id: "activity", label: "Activity Log" },
  ];

  const assignmentRows = academicAssignments.map((assignment, index) => ({
    key: assignment?._id || assignment?.id || index,
    program: formatDisplayValue(assignment?.program || assignment?.programId),
    specialization: formatDisplayValue(
      assignment?.specialization || assignment?.specializationId,
      "No specialization",
    ),
    semester: formatSemester(assignment?.semester || assignment?.semesterId),
    role: formatRole(
      assignment?.role ||
        (assignment?.isCoordinator ? "coordinator" : "student"),
    ),
    subjects: formatSubjects(assignment?.assignedSubjects),
    status: assignment?.status || currentUser?.status || "active",
    isPrimary: Boolean(assignment?.isPrimary),
  }));

  const renderAssignmentsTable = () => (
    <>
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wide text-[#7b8aa5]">
              <th className="border-b border-[#e5edf7] px-3 py-2.5">Program</th>
              <th className="border-b border-[#e5edf7] px-3 py-2.5">
                Specialization
              </th>
              <th className="border-b border-[#e5edf7] px-3 py-2.5">
                Semester
              </th>
              <th className="border-b border-[#e5edf7] px-3 py-2.5">Role</th>
              <th className="border-b border-[#e5edf7] px-3 py-2.5">
                Assigned Subjects
              </th>
              <th className="border-b border-[#e5edf7] px-3 py-2.5">Status</th>
              <th className="border-b border-[#e5edf7] px-3 py-2.5">Primary</th>
            </tr>
          </thead>
          <tbody>
            {assignmentRows.map((row) => (
              <tr key={row.key} className="text-[#14264a]">
                <td className="border-b border-[#eef2f9] px-3 py-3 font-bold">
                  {row.program}
                </td>
                <td className="border-b border-[#eef2f9] px-3 py-3 font-semibold text-[#53657f]">
                  {row.specialization}
                </td>
                <td className="border-b border-[#eef2f9] px-3 py-3 font-semibold text-[#53657f]">
                  {row.semester}
                </td>
                <td className="border-b border-[#eef2f9] px-3 py-3">
                  <Pill tone="text-blue-600 bg-blue-50 border-blue-100">
                    {row.role}
                  </Pill>
                </td>
                <td className="border-b border-[#eef2f9] px-3 py-3 font-semibold text-[#53657f]">
                  {row.subjects}
                </td>
                <td className="border-b border-[#eef2f9] px-3 py-3">
                  <Pill
                    tone={
                      row.status?.toLowerCase() === "active"
                        ? "text-green-600 bg-green-50 border-green-100"
                        : "text-[#53657f] bg-[#f1f5fb] border-[#e5edf7]"
                    }
                  >
                    {formatDisplayValue(row.status)}
                  </Pill>
                </td>
                <td className="border-b border-[#eef2f9] px-3 py-3">
                  {row.isPrimary ? (
                    <Pill tone="text-blue-600 bg-blue-50 border-blue-100">
                      Primary
                    </Pill>
                  ) : (
                    <Pill>Secondary</Pill>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 space-y-2 sm:hidden">
        {assignmentRows.map((row) => (
          <div
            key={row.key}
            className="rounded-lg border border-[#e5edf7] bg-[#f9fbfe] p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-extrabold text-[#14264a]">
                {row.program}
              </p>
              {row.isPrimary ? (
                <Pill tone="text-blue-600 bg-blue-50 border-blue-100">
                  Primary
                </Pill>
              ) : (
                <Pill>Secondary</Pill>
              )}
            </div>
            <div className="mt-1 space-y-0.5 text-xs font-semibold text-[#53657f]">
              <p>Specialization: {row.specialization}</p>
              <p>Semester: {row.semester}</p>
              <p>Assigned Subjects: {row.subjects}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone="text-blue-600 bg-blue-50 border-blue-100">
                {row.role}
              </Pill>
              <Pill
                tone={
                  row.status?.toLowerCase() === "active"
                    ? "text-green-600 bg-green-50 border-green-100"
                    : "text-[#53657f] bg-[#f1f5fb] border-[#e5edf7]"
                }
              >
                {formatDisplayValue(row.status)}
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) resolvedOnClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[94dvh] w-full max-w-[1500px] overflow-y-auto rounded-2xl border border-[#dfe7f3] bg-[#f6f9fe] p-3 shadow-[0_24px_90px_rgba(15,23,42,0.18)] sm:p-5 lg:p-6"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#31547e]">
              <span>Users</span>
              <span>/</span>
              <span className="truncate text-[#14264a]">
                {fullName || "User Profile"}
              </span>
            </div>
            <h1
              id="user-details-title"
              className="text-3xl font-extrabold leading-tight text-[#0f2744] sm:text-4xl"
            >
              User Profile
            </h1>
            <p className="mt-2 text-sm font-medium text-[#4f6482]">
              View user details and academic information.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={16} />
              Delete User
            </button>

            <button
              type="button"
              onClick={resolvedOnClose}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e2f0] bg-white px-4 text-sm font-bold text-[#14264a] shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Users
            </button>
          </div>
        </div>

        {statusMessage ? (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-bold ${
              statusMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {statusMessage.text}
          </div>
        ) : null}

        <section className={`${cardClass} px-8 py-8`}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_0.8fr] lg:divide-x lg:divide-[#e5edf7]">
            <div className="flex min-w-0 items-center gap-6 lg:pr-8">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-50 text-3xl font-extrabold text-blue-600">
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={fullName || "User avatar"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(currentUser)
                )}
              </div>
              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-extrabold text-[#14264a]">
                    {fullName || "Unnamed User"}
                  </h2>
                  <Pill
                    tone={
                      isActive
                        ? "text-green-600 bg-green-50 border-green-100"
                        : "text-red-600 bg-red-50 border-red-100"
                    }
                  >
                    {currentUser?.status || "Unknown"}
                  </Pill>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Pill tone="text-blue-600 bg-blue-50 border-blue-100">
                    {primaryRoleLabel || "No role"}
                  </Pill>
                  <Pill>{formatDisplayValue(institutionId)}</Pill>
                </div>
                <div className="space-y-1 text-sm font-bold text-[#53657f]">
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="shrink-0 text-blue-600" />
                    <span className="truncate">{universityEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7b8aa5]">
                University Information
              </p>
              <div className="mt-4 divide-y divide-[#eef2f9]">
                <StatRow label="University Email" value={universityEmail} />
                <StatRow
                  label="Institution ID"
                  value={formatDisplayValue(institutionId)}
                />
                <StatRow
                  label="Personal Email"
                  value={formatDisplayValue(currentUser?.personalEmail)}
                />
                <StatRow
                  label="Date of Birth"
                  value={formatDate(
                    currentUser?.dob || currentUser?.dateOfBirth,
                  )}
                />
                <StatRow
                  label="Joined"
                  value={formatDate(currentUser?.createdAt)}
                />
                <StatRow
                  label="Last Login"
                  value={formatDateTime(currentUser?.lastLogin)}
                />
              </div>
            </div>

            <div className="min-w-0 lg:pl-6">
              <div className="rounded-3xl border border-[#e5edf7] bg-[#f8fbff] p-6">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#14264a]">
                  <ShieldCheck size={17} className="text-green-600" />
                  Account Status
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7b8aa5]">
                      Status
                    </p>
                    <p
                      className={`mt-1 text-lg font-extrabold ${
                        isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {currentUser?.status || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7b8aa5]">
                      Verification
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#14264a]">
                      {currentUser?.emailVerified ||
                      currentUser?.isEmailVerified ||
                      currentUser?.isVerified
                        ? "Verified"
                        : "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7b8aa5]">
                      Member since
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#14264a]">
                      {formatDate(currentUser?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-5 flex gap-6 border-b border-[#dfe7f3] px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px border-b-2 pb-3 text-sm font-extrabold transition ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-[#7b8aa5] hover:text-[#14264a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                  <section className={`${cardClass} px-6 py-5`}>
                    <CardHeader
                      icon={User}
                      title="Personal Information"
                      action={
                        !isEditing && (
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2f0] bg-white px-3 py-2 text-xs font-extrabold text-[#14264a] transition hover:bg-slate-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                        )
                      }
                    />

                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailField
                        label="First Name"
                        value={formatDisplayValue(currentUser?.firstName)}
                        isEditing={isEditing}
                        editor={
                          <input
                            id="firstName"
                            name="firstName"
                            value={draft.firstName}
                            onChange={(event) =>
                              handleChange("firstName", event.target.value)
                            }
                            className={fieldClass}
                          />
                        }
                      />
                      <DetailField
                        label="Middle Name"
                        value={formatDisplayValue(currentUser?.middleName)}
                        isEditing={isEditing}
                        editor={
                          <input
                            id="middleName"
                            name="middleName"
                            value={draft.middleName}
                            onChange={(event) =>
                              handleChange("middleName", event.target.value)
                            }
                            className={fieldClass}
                          />
                        }
                      />
                      <DetailField
                        label="Last Name"
                        value={formatDisplayValue(currentUser?.lastName)}
                        isEditing={isEditing}
                        editor={
                          <input
                            id="lastName"
                            name="lastName"
                            value={draft.lastName}
                            onChange={(event) =>
                              handleChange("lastName", event.target.value)
                            }
                            className={fieldClass}
                          />
                        }
                      />
                      <DetailField
                        label="Gender"
                        value={formatDisplayValue(currentUser?.gender)}
                        isEditing={isEditing}
                        editor={
                          <select
                            id="gender"
                            name="gender"
                            value={draft.gender}
                            onChange={(event) =>
                              handleChange("gender", event.target.value)
                            }
                            className={`${fieldClass} appearance-none`}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        }
                      />
                      <DetailField
                        label="Date of Birth"
                        value={formatDate(
                          currentUser?.dob || currentUser?.dateOfBirth,
                        )}
                        isEditing={isEditing}
                        editor={
                          <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={toDateInputValue(draft.dob)}
                            onChange={(event) =>
                              handleChange("dob", event.target.value)
                            }
                            className={fieldClass}
                          />
                        }
                      />
                      <DetailField
                        label="Personal Email"
                        value={formatDisplayValue(currentUser?.personalEmail)}
                        isEditing={isEditing}
                        editor={
                          <input
                            id="personalEmail"
                            name="personalEmail"
                            type="email"
                            value={draft.personalEmail}
                            onChange={(event) =>
                              handleChange("personalEmail", event.target.value)
                            }
                            className={fieldClass}
                          />
                        }
                      />
                    </div>

                    {isEditing && (
                      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#e5edf7] pt-5 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="h-11 rounded-lg border border-[#d8e2f0] bg-white px-8 text-sm font-extrabold text-[#14264a] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </section>

                  <section className={`${cardClass} p-4 sm:p-6`}>
                    <CardHeader
                      icon={GraduationCap}
                      title="Academic Assignments"
                    />
                    {assignmentRows.length > 0 ? (
                      renderAssignmentsTable()
                    ) : (
                      <EmptyState
                        icon={BookOpen}
                        title="No assignments yet"
                        description="This user has no academic assignments on record."
                      />
                    )}
                  </section>

                  <section className={`${cardClass} p-4 sm:p-6`}>
                    <CardHeader icon={Shield} title="Roles" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {roleCatalog.map((role) => {
                        const hasRole = (currentUser?.roles || []).includes(
                          role.value,
                        );
                        return (
                          <Pill
                            key={role.value}
                            tone={
                              hasRole
                                ? role.tone
                                : "text-[#a7b3c6] bg-[#f5f8fc] border-[#e5edf7]"
                            }
                          >
                            {hasRole ? role.label : `(No ${role.label} Role)`}
                          </Pill>
                        );
                      })}
                    </div>
                  </section>

                  <section className={`${cardClass} p-4 sm:p-6`}>
                    <CardHeader
                      icon={KeyRound}
                      title="Account & Security"
                      action={
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2f0] bg-white px-3 py-2 text-xs font-extrabold text-[#14264a] transition hover:bg-slate-50"
                        >
                          Reset Password
                        </button>
                      }
                    />
                    <div className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                      <StatRow
                        label="Account Status"
                        value={formatDisplayValue(currentUser?.status)}
                        valueClassName={
                          isActive ? "text-green-600" : "text-red-600"
                        }
                      />
                      <StatRow
                        label="Email Verified"
                        value={
                          currentUser?.emailVerified ||
                          currentUser?.isEmailVerified ||
                          currentUser?.isVerified
                            ? "Verified"
                            : "Not Verified"
                        }
                        valueClassName={
                          currentUser?.emailVerified ||
                          currentUser?.isEmailVerified ||
                          currentUser?.isVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      />
                      <StatRow
                        label="Password Changed"
                        value={formatDate(currentUser?.passwordChangedAt)}
                      />
                      <StatRow
                        label="MFA"
                        value={
                          currentUser?.mfaEnabled ? "Enabled" : "Not Enabled"
                        }
                      />
                      <StatRow
                        label="Joined"
                        value={formatDate(currentUser?.createdAt)}
                      />
                      <StatRow
                        label="Last Login"
                        value={formatDateTime(currentUser?.lastLogin)}
                      />
                    </div>
                  </section>
                </div>

                <div className="space-y-5">
                  <section className={`${cardClass} p-4 sm:p-6`}>
                    <CardHeader icon={Building2} title="Academic Summary" />
                    <div className="mt-4 divide-y divide-[#eef2f9]">
                      <StatRow label="Program" value={programName} />
                      <StatRow label="Current Semester" value={semesterLabel} />
                      <StatRow label="Academic Year" value={academicYear} />
                      <StatRow label="School" value={schoolName} />
                      <StatRow
                        label="Specialization"
                        value={specializationName}
                      />
                    </div>
                  </section>

                  <section className={`${cardClass} p-4 sm:p-6`}>
                    <CardHeader icon={Activity} title="Quick Actions" />
                    <div className="mt-4 space-y-2">
                      {quickActions.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#e5edf7] bg-[#f9fbfe] px-3.5 py-2.5 text-left text-sm font-bold text-[#14264a] transition hover:bg-blue-50"
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon size={16} className="text-blue-600" />
                            {label}
                          </span>
                          <ChevronRight size={16} className="text-[#7b8aa5]" />
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <section className={`${cardClass} p-4 sm:p-6`}>
              <CardHeader icon={GraduationCap} title="Academic Assignments" />
              {assignmentRows.length > 0 ? (
                renderAssignmentsTable()
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No assignments yet"
                  description="This user has no academic assignments on record."
                />
              )}
            </section>
          )}

          {activeTab === "activity" && (
            <section className={`${cardClass} p-4 sm:p-6`}>
              <CardHeader icon={Clock3} title="Activity Log" />
              {Array.isArray(currentUser?.activityLog) &&
              currentUser.activityLog.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {currentUser.activityLog.map((entry, index) => (
                    <div
                      key={entry?._id || entry?.id || index}
                      className="flex items-start gap-3 rounded-lg border border-[#e5edf7] bg-[#f9fbfe] px-3.5 py-3"
                    >
                      <Activity
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#14264a]">
                          {formatDisplayValue(
                            entry?.action || entry?.title,
                            "Activity",
                          )}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#53657f]">
                          {formatDateTime(entry?.timestamp || entry?.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock3}
                  title="No recent activity"
                  description="Activity for this user will show up here once available."
                />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
