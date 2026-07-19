export const getName = (user = {}) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.fullName || "Student";

export const formatDate = (value, options = {}) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    ...options,
  });
};

export const formatTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const getPersonName = (person) => {
  if (!person) return "Faculty TBA";
  return [person.firstName, person.lastName].filter(Boolean).join(" ") || person.fullName || "Faculty TBA";
};

export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;
