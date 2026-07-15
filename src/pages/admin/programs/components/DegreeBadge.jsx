const typeClasses = {
  UG: "bg-blue-50 text-[var(--stratex-blue)]",
  PG: "bg-violet-50 text-violet-600",
  Diploma: "bg-amber-50 text-amber-700",
  PhD: "bg-emerald-50 text-emerald-700",
};

const DegreeBadge = ({ type }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${typeClasses[type] || "bg-slate-100 text-slate-700"}`}>
    {type || "N/A"}
  </span>
);

export default DegreeBadge;

