export const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

export const getPersonName = (person) => {
  if (!person) return "Not assigned";
  const fullName = [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ");
  return fullName || person.universityAccount?.universityEmail || "Not assigned";
};

export const getPersonEmail = (person) =>
  person?.universityAccount?.universityEmail || person?.personalEmail || "Not available";

export const getSemesterLabel = (subject) => {
  const semester = subject?.semesterId;
  if (!semester) return "Not assigned";
  return semester.name || (semester.semesterNumber ? `Semester ${semester.semesterNumber}` : "Not assigned");
};

export const getTypeLabel = (subject) => (subject?.specializationId ? "Specialization" : "Core");

export const getProgramName = (subject) => subject?.programId?.name || "Not assigned";

export const getSchoolName = (subject) => subject?.schoolId?.name || "Not assigned";

export const getSpecializationName = (subject) => subject?.specializationId?.name || "Common Curriculum";

export const formatDate = (date, fallback = "Not available") => {
  if (!date) return fallback;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const start = now.getMonth() >= 6 ? year : year - 1;
  return `${start} - ${start + 1}`;
};
