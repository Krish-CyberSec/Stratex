const classes = {
  active: "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]",
  inactive: "bg-red-50 text-[var(--error)]",
};

const ProgramStatusBadge = ({ status }) => {
  const normalized = status || "inactive";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${classes[normalized] || classes.inactive}`}>
      {normalized}
    </span>
  );
};

export default ProgramStatusBadge;

