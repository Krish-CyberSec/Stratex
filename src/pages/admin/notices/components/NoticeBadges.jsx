const statusClasses = {
  published: "bg-green-50 text-[var(--success)]",
  draft: "bg-blue-50 text-[var(--stratex-blue)]",
  inactive: "bg-slate-100 text-slate-600",
  archived: "bg-orange-50 text-orange-700",
};

export const NoticeStatusBadge = ({ status }) => {
  const normalized = status || "draft";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-black capitalize ${statusClasses[normalized] || statusClasses.draft}`}>
      {normalized}
    </span>
  );
};

export const audienceLabel = (audience = []) => {
  if (!audience?.length || audience.includes("all")) return "All Students";

  const labels = {
    superAdmin: "Super Admin",
    schoolAdmin: "School Admin",
    faculty: "Faculty",
    coordinator: "Coordinator",
    student: "Students",
    examCell: "Exam Cell",
    all: "All",
  };

  return audience.map((item) => labels[item] || item).join(", ");
};
