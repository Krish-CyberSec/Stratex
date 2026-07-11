export const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

export const getSchoolName = (program) => program?.schoolId?.name || "Not assigned";

export const getPersonName = (person) => {
  if (!person) return "Not assigned";
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ");
  return fullName || person.name || person.universityAccount?.email || "Not assigned";
};

export const formatDateTime = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const buildSemesterCards = (duration) => {
  const count = Math.max(Number(duration || 0) * 2, 0);

  return Array.from({ length: count }, (_, index) => ({
    id: `semester-${index + 1}`,
    semesterNumber: index + 1,
    status: "active",
  }));
};

export const getSemesterNumber = (subject) =>
  subject?.semesterId?.semesterNumber || subject?.semesterNumber || null;

export const getSubjectType = (subject) => subject?.type || subject?.category || "Core";
