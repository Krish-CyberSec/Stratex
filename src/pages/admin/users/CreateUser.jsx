import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AtSign,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Info,
  Mail,
  Plus,
  Save,
  Shield,
  Trash2,
  UploadCloud,
  User,
  UserCog,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { createUser, getUsers } from "../../../services/userService";
import { getSchools } from "../../../services/schoolService";
import { getPrograms } from "../../../services/programService";
import axiosInstance from "../../../utils/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const DRAFT_KEY = "stratex-create-user-draft";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const unwrapList = (response) =>
  response?.data?.data ||
  response?.data?.schools ||
  response?.data?.programs ||
  response?.data?.specializations ||
  response?.data ||
  [];
const emailRegex =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

const isValidEmail = (email) => {
  const value = email.trim();
  return (
    value.length > 0 &&
    value.length <= 254 &&
    !value.includes("..") &&
    emailRegex.test(value)
  );
};

const normalizeEmail = (email) => email.trim().toLowerCase();

let assignmentRowCounter = 0;
const createAssignmentRow = () => ({
  localId: `row-${Date.now()}-${assignmentRowCounter++}`,
  programId: "",
  specializationId: "",
  semesterId: "",
  assignedSubjects: [],
  isCoordinator: false,
  isPrimary: false,
  status: "inactive",
  assignedBy: "",
});

const rolesThatNeedAssignments = ["student", "faculty", "coordinator"];
const assignmentBlockedRoles = ["schoolAdmin", "examCell", "superAdmin"];
const roleCards = [
  {
    value: "student",
    label: "Student",
    icon: GraduationCap,
    tone: "text-blue-600 bg-blue-50",
    description: "Access to learning platform and resources",
  },
  {
    value: "faculty",
    label: "Faculty",
    icon: UserCog,
    tone: "text-green-600 bg-green-50",
    description: "Access to teaching modules and content",
  },
  {
    value: "coordinator",
    label: "Coordinator",
    icon: Users,
    tone: "text-purple-600 bg-purple-50",
    description: "Manage programs, semesters and subjects",
  },
  {
    value: "schoolAdmin",
    label: "School Admin",
    icon: Building2,
    tone: "text-orange-600 bg-orange-50",
    description: "Manage school users and settings",
  },
  {
    value: "examCell",
    label: "Exam Cell",
    icon: BookOpen,
    tone: "text-cyan-600 bg-cyan-50",
    description: "Manage exams and assessments",
  },
  {
    value: "superAdmin",
    label: "Super Admin",
    icon: Shield,
    tone: "text-red-600 bg-red-50",
    description: "Full system access and control",
  },
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

const fieldClass =
  "h-11 w-full rounded-lg border border-[#cfdced] bg-white px-3 text-sm font-medium text-[#14264a] outline-none transition placeholder:text-[#7b8aa5] focus:border-[#2563eb] focus:ring-3 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
const labelClass = "mb-2 block text-xs font-bold text-[#14264a]";
const cardClass =
  "rounded-xl border border-[#dfe7f3] bg-white shadow-[0_8px_24px_rgba(20,38,74,0.06)]";

const createDefaultFormData = () => ({
  firstName: "",
  middleName: "",
  lastName: "",
  personalEmail: "",
  confirmPersonalEmail: "",
  countryCode: "+91",
  universityEmail: "",
  institutionId: "",
  schoolId: "",
  roles: [],
  status: "active",
  addAssignment: true,
  academicAssignments: [{ ...createAssignmentRow(), isPrimary: true }],
});

const isAllowedRoleForCurrentUser = (role, canCreatePrivilegedUsers) => {
  if (canCreatePrivilegedUsers) return true;
  return ["student", "faculty", "coordinator"].includes(role);
};

const isFacultyCoordinatorRoleSet = (roles = []) =>
  roles.length === 2 &&
  roles.includes("faculty") &&
  roles.includes("coordinator");

const normalizeRoleSet = (roles = []) => {
  const uniqueRoles = [...new Set(roles.filter(Boolean))];

  if (uniqueRoles.includes("coordinator")) {
    return ["faculty", "coordinator"];
  }

  if (uniqueRoles.includes("student")) return ["student"];
  if (uniqueRoles.includes("schoolAdmin")) return ["schoolAdmin"];
  if (uniqueRoles.includes("examCell")) return ["examCell"];
  if (uniqueRoles.includes("superAdmin")) return ["superAdmin"];
  if (uniqueRoles.includes("faculty")) return ["faculty"];

  return [];
};

const normalizeRoleSelection = (currentRoles = [], selectedRole) => {
  const roles = normalizeRoleSet(currentRoles);
  const isSelected = roles.includes(selectedRole);

  if (isSelected) {
    if (selectedRole === "faculty" && roles.includes("coordinator")) {
      return [];
    }

    return roles.filter((role) => role !== selectedRole);
  }

  if (selectedRole === "coordinator") {
    return ["faculty", "coordinator"];
  }

  if (selectedRole === "faculty") {
    return ["faculty"];
  }

  return [selectedRole];
};

const validateFormData = (formData = {}, options = {}) => {
  const { canCreatePrivilegedUsers = false } = options;
  const data = formData || {};

  const roles = normalizeRoleSet(Array.isArray(data.roles) ? data.roles : []);
  const academicAssignments = Array.isArray(data.academicAssignments)
    ? data.academicAssignments
    : [];
  const firstName = String(data.firstName ?? "").trim();
  const lastName = String(data.lastName ?? "").trim();
  const personalEmail = String(data.personalEmail ?? "").trim();
  const confirmPersonalEmail = String(data.confirmPersonalEmail ?? "").trim();
  const universityEmail = String(data.universityEmail ?? "").trim();
  const institutionId = String(data.institutionId ?? "").trim();
  const schoolId = String(data.schoolId ?? "").trim();

  const invalidRoles = roles.filter(
    (role) => !isAllowedRoleForCurrentUser(role, canCreatePrivilegedUsers),
  );

  if (invalidRoles.length) {
    return `Role(s) not allowed for your account: ${invalidRoles.join(", ")}`;
  }

  const hasAssignmentRequiringRole = roles.some((role) =>
    rolesThatNeedAssignments.includes(role),
  );
  const hasAssignmentBlockedRole = roles.some((role) =>
    assignmentBlockedRoles.includes(role),
  );

  const selectedRoleNeedsSchool =
    roles.length > 0 && !roles.includes("superAdmin");
  const selectedRoleNeedsAssignment =
    hasAssignmentRequiringRole && !hasAssignmentBlockedRole;
  const selectedFacultyLikeRole = roles.some((role) =>
    ["faculty", "coordinator"].includes(role),
  );
  const requiresSingleAssignment = roles.includes("student");
  const personalEmailVerified =
    isValidEmail(personalEmail) &&
    normalizeEmail(personalEmail) === normalizeEmail(confirmPersonalEmail);
  const universityEmailReady =
    !selectedRoleNeedsSchool || isValidEmail(universityEmail);
  const emailsAreUnique =
    !selectedRoleNeedsSchool ||
    normalizeEmail(personalEmail) !== normalizeEmail(universityEmail);

  if (!firstName) return "First name is required.";
  if (!lastName) return "Last name is required.";
  if (!personalEmail) return "Personal email is required.";
  if (!isValidEmail(personalEmail)) {
    return "Please enter a valid personal email address.";
  }
  if (!confirmPersonalEmail) {
    return "Confirm personal email before creating the user.";
  }
  if (!personalEmailVerified) {
    return "Personal email confirmation must match a valid personal email.";
  }
  if (!roles.length) return "Select at least one role.";
  if (roles.length > 1 && !isFacultyCoordinatorRoleSet(roles)) {
    return "Only Faculty can be combined with Coordinator. Student, School Admin, Exam Cell, and Super Admin must be single-role accounts.";
  }
  if (roles.includes("superAdmin") && roles.length > 1) {
    return "Super Admin cannot be combined with other roles.";
  }
  if (hasAssignmentBlockedRole && hasAssignmentRequiringRole) {
    return "School Admin, Exam Cell, and Super Admin roles cannot be combined with Student, Faculty, or Coordinator roles.";
  }
  if (selectedRoleNeedsSchool && !schoolId) return "School is required.";
  if (selectedRoleNeedsSchool && !institutionId.trim()) {
    return "Institution ID is required.";
  }
  if (selectedRoleNeedsSchool && !universityEmail.trim()) {
    return "University email is required.";
  }
  if (universityEmail.trim() && !isValidEmail(universityEmail)) {
    return "Please enter a valid university email address.";
  }
  if (
    selectedRoleNeedsSchool &&
    normalizeEmail(personalEmail) === normalizeEmail(universityEmail)
  ) {
    return "Personal and university email must be different.";
  }
  if (selectedRoleNeedsAssignment && !data.addAssignment) {
    return "Academic assignment is required for the selected role.";
  }

  if (selectedRoleNeedsAssignment && data.addAssignment) {
    const rows = academicAssignments;

    if (requiresSingleAssignment && rows.length > 1) {
      return "Students must have exactly one academic assignment.";
    }

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const rowLabel = rows.length > 1 ? ` (assignment ${index + 1})` : "";

      if (!row.programId) {
        return `Program is required for academic assignment${rowLabel}.`;
      }
      if (!row.semesterId) {
        return `Semester is required for academic assignment${rowLabel}.`;
      }
      if (selectedFacultyLikeRole && row.assignedSubjects.length === 0) {
        return `Faculty and coordinator users must be assigned to at least one subject${rowLabel}.`;
      }
    }

    if (rows.filter((row) => row.isPrimary).length !== 1) {
      return "Exactly one academic assignment must be marked as primary.";
    }

    const duplicateKey = (row) =>
      [row.programId, row.specializationId || "", row.semesterId].join("|");
    const seenKeys = new Set();

    for (const row of rows) {
      const key = duplicateKey(row);
      if (seenKeys.has(key)) {
        return "Duplicate academic assignments are not allowed (same program, specialization and semester).";
      }
      seenKeys.add(key);
    }
  }

  return "";
};

const readDraftFromStorage = (canCreatePrivilegedUsers = false) => {
  if (typeof window === "undefined") {
    return createDefaultFormData();
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return createDefaultFormData();
    }

    const parsed = JSON.parse(raw);

    const normalizedDraft = {
      ...createDefaultFormData(),
      ...parsed,
      roles: normalizeRoleSet(Array.isArray(parsed.roles) ? parsed.roles : []),
      academicAssignments:
        Array.isArray(parsed.academicAssignments) &&
        parsed.academicAssignments.length
          ? parsed.academicAssignments.map((row) => ({
              ...createAssignmentRow(),
              ...row,
              localId: row.localId || `row-${Date.now()}-${Math.random()}`,
            }))
          : [{ ...createAssignmentRow(), isPrimary: true }],
    };

    const validationMessage = validateFormData(normalizedDraft, {
      canCreatePrivilegedUsers,
    });

    if (validationMessage) {
      window.localStorage.removeItem(DRAFT_KEY);
      return createDefaultFormData();
    }

    return normalizedDraft;
  } catch {
    window.localStorage.removeItem(DRAFT_KEY);
    return createDefaultFormData();
  }
};

const CreateUser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreatePrivilegedUsers = user?.roles?.includes("superAdmin");
  const backPath = canCreatePrivilegedUsers ? "/dashboard/users" : "/dashboard";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [assignmentOptionsByProgram, setAssignmentOptionsByProgram] = useState(
    {},
  );
  const [admins, setAdmins] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [formData, setFormData] = useState(() =>
    readDraftFromStorage(canCreatePrivilegedUsers),
  );

  const allowedRoleCards = useMemo(
    () =>
      canCreatePrivilegedUsers
        ? roleCards
        : roleCards.filter(({ value }) =>
            ["student", "faculty", "coordinator"].includes(value),
          ),
    [canCreatePrivilegedUsers],
  );

  const selectedRoleNeedsSchool =
    formData.roles.length > 0 && !formData.roles.includes("superAdmin");
  const selectedRoleNeedsAssignment =
    formData.roles.some((role) => rolesThatNeedAssignments.includes(role)) &&
    !formData.roles.some((role) => assignmentBlockedRoles.includes(role));
  const selectedOnlySuperAdmin =
    formData.roles.length === 1 && formData.roles.includes("superAdmin");
  const personalEmailVerified =
    isValidEmail(formData.personalEmail) &&
    normalizeEmail(formData.personalEmail) ===
      normalizeEmail(formData.confirmPersonalEmail);
  const universityEmailReady =
    !selectedRoleNeedsSchool || isValidEmail(formData.universityEmail);
  const emailsAreUnique =
    !selectedRoleNeedsSchool ||
    normalizeEmail(formData.personalEmail) !==
      normalizeEmail(formData.universityEmail);
  const canSendSetupEmail =
    personalEmailVerified && universityEmailReady && emailsAreUnique;
  const selectedFacultyLikeRole = formData.roles.some((role) =>
    ["faculty", "coordinator"].includes(role),
  );
  const selectedOnlyStudent =
    formData.roles.length === 1 && formData.roles.includes("student");

  const selectedSchool = schools.find(
    (school) => school._id === formData.schoolId,
  );

  const requiresSingleAssignment = formData.roles.includes("student");
  const canAddMultipleAssignments =
    selectedRoleNeedsAssignment && !requiresSingleAssignment;

  const getRowOptions = (programId) =>
    assignmentOptionsByProgram[programId] || {
      specializations: [],
      subjects: [],
    };

  const getSemesterOptionsForRow = (programId) => {
    const { subjects: rowSubjects } = getRowOptions(programId);
    const seen = new Map();

    rowSubjects.forEach((subject) => {
      const semester = subject.semesterId;
      if (semester?._id && !seen.has(semester._id)) {
        seen.set(semester._id, semester);
      }
    });

    return [...seen.values()].sort(
      (a, b) => Number(a.semesterNumber || 0) - Number(b.semesterNumber || 0),
    );
  };

  const getFilteredSubjectsForRow = (row) => {
    const { subjects: rowSubjects } = getRowOptions(row.programId);

    return rowSubjects.filter((subject) => {
      const matchesSemester =
        !row.semesterId || subject.semesterId?._id === row.semesterId;
      const matchesSpecialization = row.specializationId
        ? subject.specializationId?._id === row.specializationId ||
          !subject.specializationId
        : !subject.specializationId;

      return matchesSemester && matchesSpecialization;
    });
  };

  const fullName =
    [formData.firstName, formData.middleName, formData.lastName]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ") || "John Doe";
  const previewEmail =
    formData.universityEmail ||
    formData.personalEmail ||
    "john.doe@university.edu.in";
  const initials = [formData.firstName?.[0], formData.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const checklist = [
    {
      label: "Personal information",
      done:
        formData.firstName.trim() &&
        formData.lastName.trim() &&
        personalEmailVerified,
    },
    {
      label: "University account",
      done:
        !selectedRoleNeedsSchool ||
        (formData.schoolId &&
          isValidEmail(formData.universityEmail) &&
          formData.institutionId.trim()),
    },
    {
      label: "At least one role",
      done: formData.roles.length > 0,
    },
    {
      label: "Setup email ready",
      done: formData.roles.length > 0 && canSendSetupEmail,
    },
    {
      label: "Academic assignment (if applicable)",
      done:
        !selectedRoleNeedsAssignment ||
        !formData.addAssignment ||
        (formData.academicAssignments.every(
          (row) =>
            row.programId &&
            row.semesterId &&
            (!selectedFacultyLikeRole || row.assignedSubjects.length > 0),
        ) &&
          formData.academicAssignments.filter((row) => row.isPrimary).length ===
            1),
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadInitialOptions = async () => {
      setLoadingOptions(true);
      setError("");

      try {
        const [schoolsResponse, adminsResponse] = await Promise.all([
          getSchools({
            page: 1,
            limit: 100,
            status: "active",
            sortBy: "name",
            order: "asc",
          }),
          getUsers({
            page: 1,
            limit: 100,
            role: "schoolAdmin",
            status: "active",
          }),
        ]);

        if (!isMounted) return;

        const schoolList = unwrapList(schoolsResponse);
        setSchools(schoolList);
        setAdmins(unwrapList(adminsResponse));

        if (!canCreatePrivilegedUsers && user?.schoolId) {
          setFormData((prev) => ({
            ...prev,
            schoolId: String(user.schoolId),
          }));
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load form options"));
        }
      } finally {
        if (isMounted) {
          setLoadingOptions(false);
        }
      }
    };

    loadInitialOptions();

    return () => {
      isMounted = false;
    };
  }, [canCreatePrivilegedUsers, user?.schoolId]);

  useEffect(() => {
    let isMounted = true;

    const loadPrograms = async () => {
      if (!formData.schoolId) {
        setPrograms([]);
        return;
      }

      try {
        const response = await getPrograms({
          page: 1,
          limit: 100,
          schoolId: formData.schoolId,
          status: "active",
          sortBy: "name",
          order: "asc",
        });

        if (isMounted) {
          setPrograms(unwrapList(response));
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load programs"));
        }
      }
    };

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, [formData.schoolId]);

  useEffect(() => {
    let isMounted = true;

    const programIds = [
      ...new Set(
        formData.academicAssignments
          .map((row) => row.programId)
          .filter(Boolean),
      ),
    ];
    const missingProgramIds = programIds.filter(
      (programId) => !assignmentOptionsByProgram[programId],
    );

    if (!missingProgramIds.length) {
      return () => {
        isMounted = false;
      };
    }

    const loadAcademicOptions = async () => {
      try {
        const entries = await Promise.all(
          missingProgramIds.map(async (programId) => {
            const [specializationsResponse, subjectsResponse] =
              await Promise.all([
                axiosInstance.get("/specializations", {
                  params: {
                    page: 1,
                    limit: 100,
                    programId,
                    status: "active",
                    sortBy: "name",
                    order: "asc",
                  },
                }),
                axiosInstance.get("/subjects", {
                  params: {
                    page: 1,
                    limit: 200,
                    schoolId: formData.schoolId || undefined,
                    programId,
                    status: "active",
                    sortBy: "name",
                    order: "asc",
                  },
                }),
              ]);

            return [
              programId,
              {
                specializations: unwrapList(specializationsResponse),
                subjects: unwrapList(subjectsResponse),
              },
            ];
          }),
        );

        if (isMounted) {
          setAssignmentOptionsByProgram((prev) => ({
            ...prev,
            ...Object.fromEntries(entries),
          }));
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load academic options"));
        }
      }
    };

    loadAcademicOptions();

    return () => {
      isMounted = false;
    };
  }, [
    formData.academicAssignments,
    formData.schoolId,
    assignmentOptionsByProgram,
  ]);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSchoolChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      schoolId: value,
      academicAssignments: prev.academicAssignments.map((row) => ({
        ...row,
        programId: "",
        specializationId: "",
        semesterId: "",
        assignedSubjects: [],
      })),
    }));
  };

  const updateAssignmentRow = (localId, patch) => {
    setFormData((prev) => ({
      ...prev,
      academicAssignments: prev.academicAssignments.map((row) =>
        row.localId === localId ? { ...row, ...patch } : row,
      ),
    }));
  };

  const handleRowProgramChange = (localId, value) => {
    updateAssignmentRow(localId, {
      programId: value,
      specializationId: "",
      semesterId: "",
      assignedSubjects: [],
    });
  };

  const handleRowSpecializationChange = (localId, value) => {
    updateAssignmentRow(localId, {
      specializationId: value,
      semesterId: "",
      assignedSubjects: [],
    });
  };

  const handleRowSemesterChange = (localId, value) => {
    updateAssignmentRow(localId, {
      semesterId: value,
      assignedSubjects: [],
    });
  };

  const addAssignmentRow = () => {
    setFormData((prev) => ({
      ...prev,
      academicAssignments: [...prev.academicAssignments, createAssignmentRow()],
    }));
  };

  const removeAssignmentRow = (localId) => {
    setFormData((prev) => {
      const remaining = prev.academicAssignments.filter(
        (row) => row.localId !== localId,
      );

      if (!remaining.length) return prev;

      const removedWasPrimary = prev.academicAssignments.find(
        (row) => row.localId === localId,
      )?.isPrimary;
      const hasPrimary = remaining.some((row) => row.isPrimary);

      return {
        ...prev,
        academicAssignments:
          removedWasPrimary && !hasPrimary
            ? remaining.map((row, index) => ({
                ...row,
                isPrimary: index === 0,
              }))
            : remaining,
      };
    });
  };

  const setPrimaryAssignmentRow = (localId) => {
    setFormData((prev) => ({
      ...prev,
      academicAssignments: prev.academicAssignments.map((row) => ({
        ...row,
        isPrimary: row.localId === localId,
      })),
    }));
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      const roles = normalizeRoleSelection(prev.roles, role);

      const needsAssignment = roles.some((item) =>
        rolesThatNeedAssignments.includes(item),
      );
      const mustBeSingleAssignment = roles.includes("student");
      const nextAssignments = !needsAssignment
        ? [{ ...createAssignmentRow(), isPrimary: true }]
        : mustBeSingleAssignment
          ? [
              {
                ...(prev.academicAssignments[0] || createAssignmentRow()),
                isPrimary: true,
              },
            ]
          : prev.academicAssignments;

      return {
        ...prev,
        roles,
        addAssignment: needsAssignment ? prev.addAssignment : false,
        schoolId: roles.includes("superAdmin") ? "" : prev.schoolId,
        universityEmail: roles.includes("superAdmin")
          ? ""
          : prev.universityEmail,
        institutionId: roles.includes("superAdmin") ? "" : prev.institutionId,
        academicAssignments: nextAssignments,
      };
    });

    if (error) setError("");
  };

  const toggleAssignmentSubject = (localId, subjectId) => {
    setFormData((prev) => ({
      ...prev,
      academicAssignments: prev.academicAssignments.map((row) =>
        row.localId === localId
          ? {
              ...row,
              assignedSubjects: row.assignedSubjects.includes(subjectId)
                ? row.assignedSubjects.filter((id) => id !== subjectId)
                : [...row.assignedSubjects, subjectId],
            }
          : row,
      ),
    }));
  };

  const validateForm = () =>
    validateFormData(formData, { canCreatePrivilegedUsers });

  const buildPayload = () => {
    const roles = normalizeRoleSet(formData.roles);

    const hasAssignmentRequiringRole = roles.some((role) =>
      rolesThatNeedAssignments.includes(role),
    );
    const hasAssignmentBlockedRole = roles.some((role) =>
      assignmentBlockedRoles.includes(role),
    );
    const shouldIncludeAcademicAssignments =
      hasAssignmentRequiringRole && !hasAssignmentBlockedRole;

    const payload = {
      firstName: formData.firstName.trim().replace(/\s+/g, " "),
      middleName: formData.middleName.trim().replace(/\s+/g, " ") || undefined,
      lastName: formData.lastName.trim().replace(/\s+/g, " "),
      personalEmail: normalizeEmail(formData.personalEmail),
      roles,
      status: formData.status,
    };

    if (!roles.includes("superAdmin")) {
      payload.schoolId = formData.schoolId;
      payload.universityAccount = {
        universityEmail: normalizeEmail(formData.universityEmail),
        institutionId: formData.institutionId.trim(),
      };
    }

    if (shouldIncludeAcademicAssignments) {
      payload.academicAssignments = formData.academicAssignments.map((row) => ({
        programId: row.programId,
        specializationId: row.specializationId || null,
        semesterId: row.semesterId,
        assignedSubjects: roles.includes("student") ? [] : row.assignedSubjects,
        isCoordinator: Boolean(row.isCoordinator),
        isPrimary: row.isPrimary,
        status: row.status,
        assignedBy: row.assignedBy || undefined,
      }));
    }

    return payload;
  };

  const buildSubmitPayload = () => {
    const payload = buildPayload();

    if (!photoFile) {
      return payload;
    }

    const formPayload = new FormData();
    formPayload.append("payload", JSON.stringify(payload));
    formPayload.append("profile", photoFile);
    return formPayload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await createUser(buildSubmitPayload());
      const message =
        response.data?.message || "User created and setup email sent.";

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_KEY);
      }

      navigate(backPath, {
        state: canCreatePrivilegedUsers ? { message } : undefined,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create user"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      setSuccess("");
      return;
    }

    const draftPayload = {
      ...formData,
      savedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draftPayload));
    }

    setError("");
    setSuccess("Draft saved locally");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f9fe] px-3 py-4 text-[#14264a] sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mb-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e2f0] bg-white px-4 text-sm font-bold text-[#14264a] shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>

        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#31547e]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Users</span>
            <span>/</span>
            <span className="text-[#14264a]">Create New User</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-[#0f2744] sm:text-4xl">
            Create New User
          </h1>
          <p className="mt-2 text-sm font-medium text-[#4f6482]">
            Add a new user to the system and assign roles, academic assignments
            and access level.
          </p>
        </div>

        {(error || success) && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-bold ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]"
        >
          <div className="space-y-4">
            <section className={`${cardClass} p-4 sm:p-6`}>
              <SectionTitle
                number="1"
                icon={User}
                title="Personal Information"
                description="Basic details about the user."
              />

              <div className="mt-6 grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
                <div className="flex flex-col items-center lg:items-start">
                  <p className={`${labelClass} text-center lg:text-left`}>
                    Profile Photo
                  </p>
                  <label className="mx-auto flex aspect-square w-full max-w-[210px] cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-[#b8c9df] bg-white text-center transition hover:border-blue-400 hover:bg-blue-50/40 lg:mx-0">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (!file) return;

                        setPhotoFile(file);
                        setPhotoName(file.name);
                        setPhotoPreview(URL.createObjectURL(file));
                      }}
                    />
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <UploadCloud size={24} />
                    </span>
                    <span className="mt-3 text-sm font-extrabold text-blue-600">
                      Upload Photo
                    </span>
                    <span className="mt-1 px-6 text-xs font-semibold leading-5 text-[#53657f]">
                      {photoName || "PNG, JPG or SVG. Max 2MB."}
                    </span>
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <TextField
                    id="firstName"
                    name="firstName"
                    required
                    label="First Name"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(value) => updateField("firstName", value)}
                  />
                  <TextField
                    id="middleName"
                    name="middleName"
                    label="Middle Name"
                    placeholder="Enter middle name"
                    value={formData.middleName}
                    onChange={(value) => updateField("middleName", value)}
                  />
                  <TextField
                    id="lastName"
                    name="lastName"
                    required
                    label="Last Name"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(value) => updateField("lastName", value)}
                  />
                  <TextField
                    id="personalEmail"
                    name="personalEmail"
                    required
                    icon={Mail}
                    className="lg:col-span-2"
                    label="Personal Email"
                    placeholder="e.g. rahul.sharma@gmail.com"
                    type="email"
                    value={formData.personalEmail}
                    onChange={(value) => updateField("personalEmail", value)}
                    state={
                      formData.personalEmail
                        ? isValidEmail(formData.personalEmail)
                          ? "valid"
                          : "invalid"
                        : ""
                    }
                    hint={
                      formData.personalEmail
                        ? isValidEmail(formData.personalEmail)
                          ? "Valid email format"
                          : "Enter a complete email address"
                        : "Password setup mail is sent here"
                    }
                  />
                  <TextField
                    id="confirmPersonalEmail"
                    name="confirmPersonalEmail"
                    required
                    icon={CheckCircle2}
                    label="Confirm Personal Email"
                    placeholder="Re-enter personal email"
                    type="email"
                    value={formData.confirmPersonalEmail}
                    onChange={(value) =>
                      updateField("confirmPersonalEmail", value)
                    }
                    state={
                      formData.confirmPersonalEmail
                        ? personalEmailVerified
                          ? "valid"
                          : "invalid"
                        : ""
                    }
                    hint={
                      formData.confirmPersonalEmail
                        ? personalEmailVerified
                          ? "Email confirmed for setup mail"
                          : "Must match the personal email exactly"
                        : "Confirms the setup mail destination"
                    }
                  />
                </div>
              </div>
            </section>

            <section className={`${cardClass} p-4 sm:p-6`}>
              <SectionTitle
                number="2"
                icon={Shield}
                title="Roles"
                description="Choose the user's access level before assigning account details."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {allowedRoleCards.map((role) => {
                  const Icon = role.icon;
                  const selected = formData.roles.includes(role.value);

                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => toggleRole(role.value)}
                      className={`relative min-h-[132px] rounded-lg border p-4 text-center transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                          : "border-[#d8e2f0] bg-white hover:border-blue-300"
                      }`}
                    >
                      <span
                        className={`absolute right-3 top-3 h-4 w-4 rounded border ${
                          selected
                            ? "border-blue-600 bg-blue-600"
                            : "border-[#b8c9df] bg-white"
                        }`}
                      />
                      <span
                        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${role.tone}`}
                      >
                        <Icon size={22} />
                      </span>
                      <span className="mt-3 block text-sm font-extrabold text-[#14264a]">
                        {role.label}
                      </span>
                      <span className="mt-2 block text-xs font-semibold leading-5 text-[#53657f]">
                        {role.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-bold leading-5 text-blue-700">
                <Info size={16} className="mt-0.5 shrink-0" />
                Student, School Admin, Exam Cell, and Super Admin are single-role
                accounts. Only Faculty can be combined with Coordinator.
              </div>
            </section>

            <section className={`${cardClass} p-4 sm:p-6`}>
              <SectionTitle
                number="3"
                icon={Building2}
                title="University Account"
                description="University login information for the user."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  id="schoolId"
                  name="schoolId"
                  required={selectedRoleNeedsSchool}
                  label="School"
                  value={formData.schoolId}
                  onChange={handleSchoolChange}
                  disabled={loadingOptions || !canCreatePrivilegedUsers}
                  options={schools.map((school) => ({
                    value: school._id,
                    label: school.name,
                  }))}
                  placeholder={
                    loadingOptions ? "Loading schools..." : "Select school"
                  }
                />
                <TextField
                  id="institutionId"
                  name="institutionId"
                  required={selectedRoleNeedsSchool}
                  label="Institution ID"
                  hint="Unique ID provided by the institution"
                  placeholder="Enter institution ID"
                  value={formData.institutionId}
                  onChange={(value) => updateField("institutionId", value)}
                  disabled={selectedOnlySuperAdmin}
                />
                <TextField
                  id="universityEmail"
                  name="universityEmail"
                  required={selectedRoleNeedsSchool}
                  icon={AtSign}
                  label="University Email"
                  hint={
                    selectedOnlySuperAdmin
                      ? "Not required for Super Admin"
                      : formData.universityEmail
                        ? isValidEmail(formData.universityEmail) &&
                          emailsAreUnique
                          ? "Valid and different from personal email"
                          : "Use a valid email different from personal email"
                        : "Required for school-linked users"
                  }
                  type="email"
                  placeholder="Enter university email"
                  value={formData.universityEmail}
                  onChange={(value) => updateField("universityEmail", value)}
                  disabled={selectedOnlySuperAdmin}
                  state={
                    formData.universityEmail
                      ? isValidEmail(formData.universityEmail) &&
                        emailsAreUnique
                        ? "valid"
                        : "invalid"
                      : ""
                  }
                />
                <SelectField
                  id="status"
                  name="status"
                  required
                  label="Status"
                  value={formData.status}
                  onChange={(value) => updateField("status", value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  hint="User account status"
                />
              </div>
            </section>

            <section className={`${cardClass} p-4 sm:p-6`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <SectionTitle
                  number="4"
                  icon={GraduationCap}
                  title="Academic Assignment"
                  description="Assign academic details to the user. Not applicable for Super Admin."
                />
                <label className="inline-flex items-center gap-3 text-sm font-bold text-[#14264a]">
                  Add Assignment
                  <button
                    type="button"
                    aria-pressed={formData.addAssignment}
                    onClick={() =>
                      updateField("addAssignment", !formData.addAssignment)
                    }
                    disabled={!selectedRoleNeedsAssignment}
                    className={`flex h-7 w-12 items-center rounded-full p-1 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      formData.addAssignment
                        ? "justify-end bg-blue-600"
                        : "justify-start bg-slate-300"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </label>
              </div>

              <div className="mt-6 space-y-5">
                {formData.academicAssignments.map((row, index) => {
                  const rowSemesterOptions = getSemesterOptionsForRow(
                    row.programId,
                  );
                  const rowFilteredSubjects = getFilteredSubjectsForRow(row);
                  const rowSpecializations = getRowOptions(
                    row.programId,
                  ).specializations;

                  return (
                    <div
                      key={row.localId}
                      className="rounded-xl border border-[#dfe7f3] bg-[#f8fafd] p-4 sm:p-5"
                    >
                      {formData.academicAssignments.length > 1 && (
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wide text-[#53657f]">
                            Assignment {index + 1}
                            {row.isPrimary && (
                              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">
                                Primary
                              </span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAssignmentRow(row.localId)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!formData.addAssignment}
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      )}

                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <SelectField
                          id={`programId-${row.localId}`}
                          required={selectedRoleNeedsAssignment}
                          label="Program"
                          value={row.programId}
                          onChange={(value) =>
                            handleRowProgramChange(row.localId, value)
                          }
                          disabled={
                            !formData.addAssignment || !formData.schoolId
                          }
                          options={programs.map((program) => ({
                            value: program._id,
                            label: program.name,
                          }))}
                          placeholder="Select program"
                        />
                        <SelectField
                          id={`specializationId-${row.localId}`}
                          label="Specialization (Optional)"
                          value={row.specializationId}
                          onChange={(value) =>
                            handleRowSpecializationChange(row.localId, value)
                          }
                          disabled={!formData.addAssignment || !row.programId}
                          options={rowSpecializations.map((specialization) => ({
                            value: specialization._id,
                            label: specialization.name,
                          }))}
                          placeholder="Select specialization"
                        />
                        <SelectField
                          id={`semesterId-${row.localId}`}
                          required={selectedRoleNeedsAssignment}
                          label="Semester"
                          value={row.semesterId}
                          onChange={(value) =>
                            handleRowSemesterChange(row.localId, value)
                          }
                          disabled={!formData.addAssignment || !row.programId}
                          options={rowSemesterOptions.map((semester) => ({
                            value: semester._id,
                            label: `Semester ${semester.semesterNumber}`,
                          }))}
                          placeholder="Select semester"
                        />

                        <div className="sm:col-span-2">
                          <p className={labelClass}>
                            Assigned Subjects (For Faculty / Coordinator)
                          </p>
                          <div className="min-h-11 rounded-lg border border-[#cfdced] bg-white px-3 py-2">
                            {rowFilteredSubjects.length ? (
                              <div className="flex flex-wrap gap-2">
                                {rowFilteredSubjects.map((subject) => {
                                  const selected =
                                    row.assignedSubjects.includes(subject._id);

                                  return (
                                    <button
                                      type="button"
                                      key={subject._id}
                                      onClick={() =>
                                        toggleAssignmentSubject(
                                          row.localId,
                                          subject._id,
                                        )
                                      }
                                      disabled={selectedOnlyStudent}
                                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        selected
                                          ? "border-blue-600 bg-blue-600 text-white"
                                          : "border-[#d8e2f0] bg-white text-[#53657f] hover:border-blue-300"
                                      }`}
                                    >
                                      {subject.code ? `${subject.code} - ` : ""}
                                      {subject.name}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="py-1 text-sm font-semibold text-[#7b8aa5]">
                                Select program and semester to view subjects
                              </p>
                            )}
                          </div>
                          <p className="mt-2 text-xs font-semibold text-[#53657f]">
                            Select one or more subjects
                          </p>
                        </div>

                        <CheckField
                          label="Is Coordinator?"
                          checked={row.isCoordinator}
                          onChange={(checked) =>
                            updateAssignmentRow(row.localId, {
                              isCoordinator: checked,
                            })
                          }
                          disabled={!formData.roles.includes("coordinator")}
                        />
                        <label className="flex items-center gap-3 self-end pb-3 text-xs font-bold text-[#14264a]">
                          <input
                            type="radio"
                            name="primaryAssignment"
                            checked={row.isPrimary}
                            onChange={() =>
                              setPrimaryAssignmentRow(row.localId)
                            }
                            disabled={formData.academicAssignments.length === 1}
                            className="h-4 w-4 accent-blue-600 disabled:opacity-50"
                          />
                          Primary Assignment
                        </label>
                        <SelectField
                          id={`assignmentStatus-${row.localId}`}
                          required={selectedRoleNeedsAssignment}
                          label="Assignment Status"
                          value={row.status}
                          onChange={(value) =>
                            updateAssignmentRow(row.localId, { status: value })
                          }
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                          ]}
                        />
                        <SelectField
                          id={`assignedBy-${row.localId}`}
                          className="sm:col-span-2"
                          label="Assigned By (Optional)"
                          value={row.assignedBy}
                          onChange={(value) =>
                            updateAssignmentRow(row.localId, {
                              assignedBy: value,
                            })
                          }
                          options={admins.map((admin) => ({
                            value: admin._id,
                            label:
                              `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
                          }))}
                          placeholder="Select admin"
                        />
                      </div>
                    </div>
                  );
                })}

                {canAddMultipleAssignments && (
                  <button
                    type="button"
                    onClick={addAssignmentRow}
                    disabled={!formData.addAssignment}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-4 py-2.5 text-xs font-black text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={14} />
                    Add Another Assignment
                  </button>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e5edf7] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(backPath)}
                  className="h-11 rounded-lg border border-[#d8e2f0] bg-white px-8 text-sm font-extrabold text-[#14264a] transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-8 text-sm font-extrabold text-blue-600 transition hover:bg-blue-50"
                >
                  <Save size={16} />
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loadingOptions}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UserPlus size={16} />
                  {isSubmitting
                    ? "Creating and sending email..."
                    : "Create User"}
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
            <SideCard
              icon={User}
              title="User Preview"
              subtitle="Live preview of the user details."
            >
              <div className="mt-5 text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-blue-50">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : initials ? (
                    <span className="text-3xl font-extrabold text-blue-500">
                      {initials}
                    </span>
                  ) : (
                    <User size={58} className="text-blue-500" />
                  )}
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-[#14264a]">
                  {fullName}
                </h2>
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-extrabold capitalize ${
                    formData.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
              <PreviewRow icon={Mail} text={previewEmail} />
              <PreviewRow
                icon={Building2}
                text={`School: ${selectedSchool?.name || "Not selected"}`}
              />
              <PreviewRow
                icon={Shield}
                text={`Role(s): ${
                  formData.roles.length
                    ? formData.roles.map(formatRole).join(", ")
                    : "Not selected yet"
                }`}
              />
            </SideCard>

            <SideCard
              icon={GraduationCap}
              title="Selected Academic Assignment(s)"
              subtitle="The assignment details will appear here."
            >
              <div className="mt-5 rounded-xl border border-dashed border-[#b8c9df] bg-white px-4 py-4">
                {formData.academicAssignments.some(
                  (row) => row.programId || row.semesterId,
                ) ? (
                  <div className="space-y-4">
                    {formData.academicAssignments.map((row, index) => {
                      const rowProgram = programs.find(
                        (program) => program._id === row.programId,
                      );
                      const rowSpecialization = getRowOptions(
                        row.programId,
                      ).specializations.find(
                        (specialization) =>
                          specialization._id === row.specializationId,
                      );
                      const rowSemester = getSemesterOptionsForRow(
                        row.programId,
                      ).find((semester) => semester._id === row.semesterId);

                      return (
                        <div
                          key={row.localId}
                          className="space-y-1 text-sm font-bold text-[#53657f]"
                        >
                          {formData.academicAssignments.length > 1 && (
                            <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">
                              Assignment {index + 1}
                              {row.isPrimary ? " · Primary" : ""}
                            </p>
                          )}
                          <p className="text-[#14264a]">
                            {rowProgram?.name || "Program not selected"}
                          </p>
                          <p>
                            {rowSpecialization?.name || "No specialization"}
                          </p>
                          <p>
                            {rowSemester
                              ? `Semester ${rowSemester.semesterNumber}`
                              : "Semester not selected"}
                          </p>
                          <p>
                            {row.assignedSubjects.length} subject(s) selected
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      <BookOpen size={24} />
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-[#14264a]">
                      No assignment added
                    </p>
                    <p className="mx-auto mt-2 max-w-48 text-xs font-semibold leading-5 text-[#53657f]">
                      Select program, semester and subjects to see summary.
                    </p>
                  </div>
                )}
              </div>
            </SideCard>

            <SideCard
              icon={CheckCircle2}
              title="Validation Checklist"
              subtitle="Ensure all required fields are completed."
            >
              <div className="mt-5 space-y-4">
                {checklist.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 text-xs font-bold"
                  >
                    <span className="flex items-center gap-2 text-[#53657f]">
                      {item.done ? (
                        <CheckCircle2 size={15} className="text-green-600" />
                      ) : (
                        <XCircle size={15} className="text-[#7b8aa5]" />
                      )}
                      {item.label}
                    </span>
                    <span
                      className={
                        item.done ? "text-green-600" : "text-[#53657f]"
                      }
                    >
                      {item.done ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </SideCard>

            <SideCard icon={Info} title="Important Notes">
              <ul className="mt-5 space-y-3 text-xs font-semibold leading-5 text-[#53657f]">
                <li>Students will have no subjects assigned.</li>
                <li>
                  Faculty/Coordinator must be assigned to at least one subject.
                </li>
                <li>Super Admin does not require any academic assignment.</li>
                <li>
                  Setup mail is sent so the user can create a
                  password.
                </li>
                <li>Personal and university emails must be unique.</li>
              </ul>
            </SideCard>
          </aside>
        </form>
      </div>
    </div>
  );
};

const SectionTitle = ({ number, icon: Icon, title, description }) => (
  <div className="flex items-start gap-3">
    <Icon size={18} className="mt-0.5 text-blue-600" />
    <div>
      <h2 className="text-base font-extrabold text-[#14264a]">
        {number}. {title}
      </h2>
      <p className="mt-1 text-xs font-semibold text-[#53657f]">{description}</p>
    </div>
  </div>
);

const TextField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
  hint,
  className = "",
  disabled = false,
  state = "",
}) => {
  const stateClass =
    state === "valid"
      ? "border-green-500 focus:border-green-600 focus:ring-green-100"
      : state === "invalid"
        ? "border-red-500 focus:border-red-600 focus:ring-red-100"
        : "";
  const stateTextClass =
    state === "valid"
      ? "text-green-700"
      : state === "invalid"
        ? "text-red-600"
        : "text-[#53657f]";

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              state === "valid"
                ? "text-green-600"
                : state === "invalid"
                  ? "text-red-500"
                  : "text-[#53657f]"
            }`}
          />
        )}
        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={state === "invalid"}
          className={`${fieldClass} ${Icon ? "pl-10" : ""} ${stateClass}`}
        />
      </div>
      {hint && (
        <p className={`mt-2 text-xs font-semibold ${stateTextClass}`}>{hint}</p>
      )}
    </div>
  );
};

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = "Select option",
  hint,
  className = "",
}) => (
  <div className={className}>
    <label htmlFor={id} className={labelClass}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        id={id}
        name={name || id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`${fieldClass} appearance-none pr-10`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#53657f]"
      />
    </div>
    {hint && (
      <p className="mt-2 text-xs font-semibold text-[#53657f]">{hint}</p>
    )}
  </div>
);

const CheckField = ({ label, checked, onChange, disabled = false }) => (
  <label className="flex items-center gap-3 self-end pb-3 text-xs font-bold text-[#14264a]">
    <input
      type="checkbox"
      id={label.replace(/\s+/g, "-").toLowerCase()}
      name={label.replace(/\s+/g, "-").toLowerCase()}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={disabled}
      className="h-4 w-4 rounded border-[#b8c9df] accent-blue-600 disabled:opacity-50"
    />
    {label}
  </label>
);

const SideCard = ({ icon: Icon, title, subtitle, children }) => (
  <section className={`${cardClass} p-5`}>
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 text-blue-600" />
      <div>
        <h2 className="text-base font-extrabold text-[#14264a]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs font-semibold text-[#53657f]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const PreviewRow = ({ icon: Icon, text }) => (
  <div className="mt-4 flex min-w-0 items-center gap-3 text-sm font-bold text-[#53657f]">
    <Icon size={16} className="shrink-0 text-blue-600" />
    <span className="min-w-0 break-words">{text}</span>
  </div>
);

export default CreateUser;
