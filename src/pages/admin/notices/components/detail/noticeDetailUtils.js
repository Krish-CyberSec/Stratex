export const getPersonName = (person) => {
  if (!person) return "System";
  return [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ") || "System";
};

export const formatNoticeDate = (date) => {
  if (!date) return "--";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatFileSize = (size) => {
  if (!size) return "--";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const isPdf = (attachment) =>
  attachment?.fileType?.includes("pdf") || attachment?.name?.toLowerCase().endsWith(".pdf");
