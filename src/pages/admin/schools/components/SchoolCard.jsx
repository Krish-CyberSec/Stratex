import { ArrowRight, GraduationCap, UsersRound } from "lucide-react";
import SchoolLogo from "./SchoolLogo";

const statusStyles = {
  active:
    "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]",
  inactive:
    "bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]",
};

const SchoolCard = ({ school, onView }) => {
  const status = school.status || "active";

  return (
    <article className="flex min-h-[232px] flex-col rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--university-blue)_28%,white)] hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <SchoolLogo logo={school.logo} name={school.name} />
        <span
          className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[status] || statusStyles.inactive}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[var(--university-ink)]">
          {school.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-xs font-medium leading-5 text-[var(--text-secondary)]">
          {school.description || "No description added for this school yet."}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border-light)] pt-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
          <GraduationCap size={15} className="shrink-0" />
          <span>{school.programCount ?? 0} Programs</span>
        </div>
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
          <UsersRound size={15} className="shrink-0" />
          <span>{school.facultyCount ?? 0} Faculty</span>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--border-light)] pt-3">
        <button
          type="button"
          onClick={() => onView(school)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--stratex-blue-dark)] hover:shadow-md"
        >
          View School
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
};

export default SchoolCard;
