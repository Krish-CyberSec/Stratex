export const roleLabels = {
  superAdmin: "Super Administrator",
  schoolAdmin: "School Administrator",
  faculty: "Faculty Member",
  coordinator: "Coordinator",
  student: "Student",
  examCell: "Exam Cell",
};

export const roleScopes = {
  superAdmin: "University-wide access",
  schoolAdmin: "School administration",
  faculty: "Teaching and academic access",
  coordinator: "Program coordination",
  student: "Student academic access",
  examCell: "Examination operations",
};

export const schoolBannerRoles = new Set(["schoolAdmin", "faculty", "coordinator", "student"]);

export const getPrimaryRole = (user) => user?.primaryRole || user?.roles?.[0] || "user";

export const getRoleLabel = (role) => roleLabels[role] || "User";

export const getFullName = (user) =>
  user?.fullName ||
  [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ") ||
  "Profile User";

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

export const getUniversityEmail = (user) =>
  user?.universityAccount?.universityEmail || user?.universityEmail || user?.email || "";

export const getPersonalEmail = (user) => user?.personalEmail || "";

export const getInstitutionId = (user) => user?.universityAccount?.institutionId || "Not assigned";

export const getSchoolName = (user) =>
  user?.schoolId?.name || user?.school?.name || user?.school || "Not assigned";

export const getProfileImage = (user) =>
  user?.profileImage || user?.profilePicture || "";

export const getAssignmentSummary = (user) => {
  const primary = user?.academicAssignments?.find((item) => item.isPrimary) || user?.academicAssignments?.[0];

  return {
    program: primary?.programId?.name || "Not assigned",
    specialization: primary?.specializationId?.name || "Not assigned",
    semester: primary?.semesterId?.name || primary?.semesterId?.semesterNumber || "Not assigned",
  };
};

export const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
