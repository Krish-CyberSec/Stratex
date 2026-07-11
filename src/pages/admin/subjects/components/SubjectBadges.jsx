export const SubjectTypeBadge = ({ subject }) => {
  const type = subject?.specializationId ? "Specialization" : "Core";
  const classes = subject?.specializationId
    ? "bg-amber-50 text-amber-700"
    : "bg-purple-50 text-purple-700";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${classes}`}>
      {type}
    </span>
  );
};

export const SubjectStatusBadge = ({ status }) => {
  const normalized = status || "inactive";
  const classes =
    normalized === "active"
      ? "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]"
      : "bg-red-50 text-[var(--error)]";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${classes}`}>
      {normalized}
    </span>
  );
};
