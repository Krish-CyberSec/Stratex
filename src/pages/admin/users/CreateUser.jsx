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
  Phone,
  Save,
  Shield,
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

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const unwrapList = (response) => response.data?.data || [];
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

const rolesThatNeedAssignments = ["student", "faculty", "coordinator"];
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
  const [specializations, setSpecializations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [photoName, setPhotoName] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    personalEmail: "",
    confirmPersonalEmail: "",
    phoneNumber: "",
    countryCode: "+91",
    universityEmail: "",
    institutionId: "",
    schoolId: "",
    roles: [],
    status: "active",
    addAssignment: true,
    programId: "",
    specializationId: "",
    semesterId: "",
    assignedSubjects: [],
    isCoordinator: false,
    isPrimary: true,
    assignmentStatus: "active",
    assignedBy: "",
  });

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
  const selectedRoleNeedsAssignment = formData.roles.some((role) =>
    rolesThatNeedAssignments.includes(role),
  );
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

  const selectedSchool = schools.find((school) => school._id === formData.schoolId);
  const selectedProgram = programs.find(
    (program) => program._id === formData.programId,
  );
  const selectedSpecialization = specializations.find(
    (specialization) => specialization._id === formData.specializationId,
  );
  const selectedSemester = subjects
    .map((subject) => subject.semesterId)
    .filter(Boolean)
    .find((semester) => semester._id === formData.semesterId);

  const semesterOptions = useMemo(() => {
    const seen = new Map();

    subjects.forEach((subject) => {
      const semester = subject.semesterId;
      if (semester?._id && !seen.has(semester._id)) {
        seen.set(semester._id, semester);
      }
    });

    return [...seen.values()].sort(
      (a, b) => Number(a.semesterNumber || 0) - Number(b.semesterNumber || 0),
    );
  }, [subjects]);

  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) => {
        const matchesSemester =
          !formData.semesterId || subject.semesterId?._id === formData.semesterId;
        const matchesSpecialization = formData.specializationId
          ? subject.specializationId?._id === formData.specializationId ||
            !subject.specializationId
          : !subject.specializationId;

        return matchesSemester && matchesSpecialization;
      }),
    [formData.semesterId, formData.specializationId, subjects],
  );

  const fullName =
    [formData.firstName, formData.middleName, formData.lastName]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ") || "John Doe";
  const previewEmail =
    formData.universityEmail || formData.personalEmail || "john.doe@university.edu.in";
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
      label: "Mail verification ready",
      done: formData.roles.length > 0 && canSendSetupEmail,
    },
    {
      label: "Academic assignment (if applicable)",
      done:
        !selectedRoleNeedsAssignment ||
        !formData.addAssignment ||
        (formData.programId &&
          formData.semesterId &&
          (!formData.roles.some((role) => ["faculty", "coordinator"].includes(role)) ||
            formData.assignedSubjects.length > 0)),
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
          getUsers({ page: 1, limit: 100, role: "schoolAdmin", status: "active" }),
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

    const loadAcademicOptions = async () => {
      if (!formData.programId) {
        setSpecializations([]);
        setSubjects([]);
        return;
      }

      try {
        const [specializationsResponse, subjectsResponse] = await Promise.all([
          axiosInstance.get("/specializations", {
            params: {
              page: 1,
              limit: 100,
              programId: formData.programId,
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
              programId: formData.programId,
              specializationId: formData.specializationId || undefined,
              status: "active",
              sortBy: "name",
              order: "asc",
            },
          }),
        ]);

        if (isMounted) {
          setSpecializations(unwrapList(specializationsResponse));
          setSubjects(unwrapList(subjectsResponse));
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
  }, [formData.programId, formData.schoolId, formData.specializationId]);

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
      programId: "",
      specializationId: "",
      semesterId: "",
      assignedSubjects: [],
    }));
  };

  const handleProgramChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      programId: value,
      specializationId: "",
      semesterId: "",
      assignedSubjects: [],
    }));
  };

  const handleSpecializationChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      specializationId: value,
      semesterId: "",
      assignedSubjects: [],
    }));
  };

  const handleSemesterChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      semesterId: value,
      assignedSubjects: [],
    }));
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      let roles = prev.roles.includes(role)
        ? prev.roles.filter((item) => item !== role)
        : [...prev.roles, role];

      if (role === "superAdmin" && !prev.roles.includes(role)) {
        roles = ["superAdmin"];
      } else {
        roles = roles.filter((item) => item !== "superAdmin");
      }

      if (role === "coordinator" && !prev.roles.includes(role)) {
        roles = [...new Set([...roles, "faculty"])];
      }

      if (role === "faculty" && prev.roles.includes("coordinator")) {
        roles = roles.filter((item) => item !== "coordinator");
      }

      const needsAssignment = roles.some((item) =>
        rolesThatNeedAssignments.includes(item),
      );

      return {
        ...prev,
        roles,
        addAssignment: needsAssignment ? prev.addAssignment : false,
        isCoordinator: roles.includes("coordinator"),
        schoolId: roles.includes("superAdmin") ? "" : prev.schoolId,
        universityEmail: roles.includes("superAdmin") ? "" : prev.universityEmail,
        institutionId: roles.includes("superAdmin") ? "" : prev.institutionId,
        programId: needsAssignment ? prev.programId : "",
        specializationId: needsAssignment ? prev.specializationId : "",
        semesterId: needsAssignment ? prev.semesterId : "",
        assignedSubjects: needsAssignment ? prev.assignedSubjects : [],
      };
    });

    if (error) setError("");
  };

  const toggleSubject = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      assignedSubjects: prev.assignedSubjects.includes(subjectId)
        ? prev.assignedSubjects.filter((id) => id !== subjectId)
        : [...prev.assignedSubjects, subjectId],
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required.";
    if (!formData.lastName.trim()) return "Last name is required.";
    if (!formData.personalEmail.trim()) return "Personal email is required.";
    if (!isValidEmail(formData.personalEmail)) {
      return "Please enter a valid personal email address.";
    }
    if (!formData.confirmPersonalEmail.trim()) {
      return "Confirm personal email before creating the user.";
    }
    if (!personalEmailVerified) {
      return "Personal email confirmation must match a valid personal email.";
    }
    if (!formData.roles.length) return "Select at least one role.";
    if (formData.roles.includes("superAdmin") && formData.roles.length > 1) {
      return "Super Admin cannot be combined with other roles.";
    }
    if (selectedRoleNeedsSchool && !formData.schoolId) return "School is required.";
    if (selectedRoleNeedsSchool && !formData.institutionId.trim()) {
      return "Institution ID is required.";
    }
    if (selectedRoleNeedsSchool && !formData.universityEmail.trim()) {
      return "University email is required.";
    }
    if (
      formData.universityEmail.trim() &&
      !isValidEmail(formData.universityEmail)
    ) {
      return "Please enter a valid university email address.";
    }
    if (
      selectedRoleNeedsSchool &&
      normalizeEmail(formData.personalEmail) ===
        normalizeEmail(formData.universityEmail)
    ) {
      return "Personal and university email must be different.";
    }
    if (selectedRoleNeedsAssignment && !formData.addAssignment) {
      return "Academic assignment is required for the selected role.";
    }
    if (selectedRoleNeedsAssignment && !formData.programId) {
      return "Program is required for academic assignment.";
    }
    if (selectedRoleNeedsAssignment && !formData.semesterId) {
      return "Semester is required for academic assignment.";
    }
    if (
      selectedRoleNeedsAssignment &&
      selectedFacultyLikeRole &&
      formData.assignedSubjects.length === 0
    ) {
      return "Faculty and coordinator users must be assigned to at least one subject.";
    }

    return "";
  };

  const buildPayload = () => {
    const roles = formData.roles.includes("coordinator")
      ? [...new Set([...formData.roles, "faculty"])]
      : formData.roles;

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

    if (roles.some((role) => rolesThatNeedAssignments.includes(role))) {
      payload.academicAssignments = [
        {
          programId: formData.programId,
          specializationId: formData.specializationId || null,
          semesterId: formData.semesterId,
          assignedSubjects: roles.includes("student") ? [] : formData.assignedSubjects,
          isCoordinator: roles.includes("coordinator") || formData.isCoordinator,
          isPrimary: formData.isPrimary,
          status: formData.assignmentStatus,
          assignedBy: formData.assignedBy || undefined,
        },
      ];
    }

    return payload;
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
      const response = await createUser(buildPayload());
      const message =
        response.data?.message || "User created and verification email sent.";
      navigate(backPath, {
        state: canCreatePrivilegedUsers
          ? { message }
          : undefined,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create user"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("stratex-create-user-draft", JSON.stringify(formData));
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
            Add a new user to the system and assign roles, academic assignments and access level.
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
                      onChange={(event) =>
                        setPhotoName(event.target.files?.[0]?.name || "")
                      }
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
                    required
                    label="First Name"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(value) => updateField("firstName", value)}
                  />
                  <TextField
                    label="Middle Name"
                    placeholder="Enter middle name"
                    value={formData.middleName}
                    onChange={(value) => updateField("middleName", value)}
                  />
                  <TextField
                    required
                    label="Last Name"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(value) => updateField("lastName", value)}
                  />
                  <TextField
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
                        : "Setup verification mail is sent here"
                    }
                  />
                  <TextField
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
                          ? "Email verified for setup mail"
                          : "Must match the personal email exactly"
                        : "Confirms the setup mail destination"
                    }
                  />
                  <div>
                    <label className={labelClass}>Phone Number (Optional)</label>
                    <div className="grid grid-cols-[86px_minmax(0,1fr)]">
                      <select
                        value={formData.countryCode}
                        onChange={(event) =>
                          updateField("countryCode", event.target.value)
                        }
                        className="h-11 rounded-l-lg border border-r-0 border-[#cfdced] bg-white px-2 text-sm font-bold outline-none focus:border-[#2563eb]"
                      >
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                      </select>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#53657f]"
                        />
                        <input
                          value={formData.phoneNumber}
                          onChange={(event) =>
                            updateField("phoneNumber", event.target.value)
                          }
                          placeholder="98765 43210"
                          className={`${fieldClass} rounded-l-none pl-10`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={`${cardClass} p-4 sm:p-6`}>
              <SectionTitle
                number="2"
                icon={Building2}
                title="University Account"
                description="University login information for the user."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  required={selectedRoleNeedsSchool}
                  label="School"
                  value={formData.schoolId}
                  onChange={handleSchoolChange}
                  disabled={loadingOptions || !canCreatePrivilegedUsers}
                  options={schools.map((school) => ({
                    value: school._id,
                    label: school.name,
                  }))}
                  placeholder={loadingOptions ? "Loading schools..." : "Select school"}
                />
                <TextField
                  required={selectedRoleNeedsSchool}
                  label="Institution ID"
                  hint="Unique ID provided by the institution"
                  placeholder="Enter institution ID"
                  value={formData.institutionId}
                  onChange={(value) => updateField("institutionId", value)}
                  disabled={selectedOnlySuperAdmin}
                />
                <TextField
                  required={selectedRoleNeedsSchool}
                  icon={AtSign}
                  label="University Email"
                  hint={
                    selectedOnlySuperAdmin
                      ? "Not required for Super Admin"
                      : formData.universityEmail
                        ? isValidEmail(formData.universityEmail) && emailsAreUnique
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
                      ? isValidEmail(formData.universityEmail) && emailsAreUnique
                        ? "valid"
                        : "invalid"
                      : ""
                  }
                />
                <SelectField
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
              <SectionTitle
                number="3"
                icon={Shield}
                title="Roles"
                description="Select one or more roles for the user."
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

              <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700">
                <Info size={16} className="mt-0.5 shrink-0" />
                Select at least one role. Coordinator automatically includes Faculty
                access. A verification email is sent after creation.
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

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  required={selectedRoleNeedsAssignment}
                  label="Program"
                  value={formData.programId}
                  onChange={handleProgramChange}
                  disabled={!formData.addAssignment || !formData.schoolId}
                  options={programs.map((program) => ({
                    value: program._id,
                    label: program.name,
                  }))}
                  placeholder="Select program"
                />
                <SelectField
                  label="Specialization (Optional)"
                  value={formData.specializationId}
                  onChange={handleSpecializationChange}
                  disabled={!formData.addAssignment || !formData.programId}
                  options={specializations.map((specialization) => ({
                    value: specialization._id,
                    label: specialization.name,
                  }))}
                  placeholder="Select specialization"
                />
                <SelectField
                  required={selectedRoleNeedsAssignment}
                  label="Semester"
                  value={formData.semesterId}
                  onChange={handleSemesterChange}
                  disabled={!formData.addAssignment || !formData.programId}
                  options={semesterOptions.map((semester) => ({
                    value: semester._id,
                    label: `Semester ${semester.semesterNumber}`,
                  }))}
                  placeholder="Select semester"
                />

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Assigned Subjects (For Faculty / Coordinator)
                  </label>
                  <div className="min-h-11 rounded-lg border border-[#cfdced] bg-white px-3 py-2">
                    {filteredSubjects.length ? (
                      <div className="flex flex-wrap gap-2">
                        {filteredSubjects.map((subject) => {
                          const selected = formData.assignedSubjects.includes(
                            subject._id,
                          );

                          return (
                            <button
                              type="button"
                              key={subject._id}
                              onClick={() => toggleSubject(subject._id)}
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
                  checked={formData.isCoordinator}
                  onChange={(checked) => updateField("isCoordinator", checked)}
                  disabled={!formData.roles.includes("coordinator")}
                />
                <CheckField
                  label="Is Primary Assignment?"
                  checked={formData.isPrimary}
                  onChange={(checked) => updateField("isPrimary", checked)}
                />
                <SelectField
                  required={selectedRoleNeedsAssignment}
                  label="Assignment Status"
                  value={formData.assignmentStatus}
                  onChange={(value) => updateField("assignmentStatus", value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
                <SelectField
                  className="sm:col-span-2"
                  label="Assigned By (Optional)"
                  value={formData.assignedBy}
                  onChange={(value) => updateField("assignedBy", value)}
                  options={admins.map((admin) => ({
                    value: admin._id,
                    label: `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
                  }))}
                  placeholder="Select admin"
                />
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
                  {isSubmitting ? "Creating and sending email..." : "Create User"}
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
            <SideCard icon={User} title="User Preview" subtitle="Live preview of the user details.">
              <div className="mt-5 text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  {initials ? (
                    <span className="text-3xl font-extrabold">{initials}</span>
                  ) : (
                    <User size={58} fill="currentColor" />
                  )}
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-[#14264a]">
                  {fullName}
                </h2>
                <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold capitalize text-green-700">
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
              title="Selected Academic Assignment"
              subtitle="The assignment details will appear here."
            >
              <div className="mt-5 rounded-xl border border-dashed border-[#b8c9df] bg-white px-4 py-8 text-center">
                {selectedProgram || selectedSemester ? (
                  <div className="space-y-2 text-sm font-bold text-[#53657f]">
                    <p className="text-[#14264a]">
                      {selectedProgram?.name || "Program not selected"}
                    </p>
                    <p>{selectedSpecialization?.name || "No specialization"}</p>
                    <p>
                      {selectedSemester
                        ? `Semester ${selectedSemester.semesterNumber}`
                        : "Semester not selected"}
                    </p>
                    <p>{formData.assignedSubjects.length} subject(s) selected</p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      <BookOpen size={24} />
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-[#14264a]">
                      No assignment added
                    </p>
                    <p className="mx-auto mt-2 max-w-48 text-xs font-semibold leading-5 text-[#53657f]">
                      Select program, semester and subjects to see summary.
                    </p>
                  </>
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
                    <span className={item.done ? "text-green-600" : "text-[#53657f]"}>
                      {item.done ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </SideCard>

            <SideCard icon={Info} title="Important Notes">
              <ul className="mt-5 space-y-3 text-xs font-semibold leading-5 text-[#53657f]">
                <li>Students will have no subjects assigned.</li>
                <li>Faculty/Coordinator must be assigned to at least one subject.</li>
                <li>Super Admin does not require any academic assignment.</li>
                <li>Setup mail is sent to verify the account and create a password.</li>
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
      <label className={labelClass}>
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
    <label className={labelClass}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
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
    {hint && <p className="mt-2 text-xs font-semibold text-[#53657f]">{hint}</p>}
  </div>
);

const CheckField = ({ label, checked, onChange, disabled = false }) => (
  <label className="flex items-center gap-3 self-end pb-3 text-xs font-bold text-[#14264a]">
    <input
      type="checkbox"
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
          <p className="mt-1 text-xs font-semibold text-[#53657f]">{subtitle}</p>
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
