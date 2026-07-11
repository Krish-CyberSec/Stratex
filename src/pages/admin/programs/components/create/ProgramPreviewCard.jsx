import { BookOpen, CalendarDays, GraduationCap, Hash, Landmark } from "lucide-react";
import DegreeBadge from "../DegreeBadge";
import ProgramStatusBadge from "../ProgramStatusBadge";
import { ProgramSideCard } from "./ProgramCreateShell";

const ProgramPreviewCard = ({ form, selectedSchool }) => {
  const semesters = Number(form.duration || 0) * 2;

  const rows = [
    { label: "Program Code", value: form.code || "Auto-generated", icon: Hash },
    { label: "Degree Type", value: form.degreeType || "--", icon: BookOpen },
    { label: "Duration", value: form.duration ? `${form.duration} Years` : "-- Years", icon: CalendarDays },
    { label: "Total Semesters", value: semesters || "--", icon: GraduationCap },
  ];

  return (
    <ProgramSideCard title="Program Preview" subtitle="See how the program details will appear once created.">
      <article className="rounded-xl border border-[color-mix(in_srgb,var(--success)_24%,white)] bg-[linear-gradient(180deg,#ffffff,#f5fff9)] p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-[var(--success)]">
            <GraduationCap size={22} />
          </span>
          <ProgramStatusBadge status={form.status} />
        </div>

        <h3 className="mt-5 text-base font-bold text-[var(--university-ink)]">
          {form.name || "Program Name"}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
          <Landmark size={14} />
          {selectedSchool?.name || "School Name"}
        </p>

        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 font-bold text-[var(--university-ink)]">
                <row.icon size={14} className="text-[var(--stratex-blue)]" />
                {row.label}
              </span>
              {row.label === "Degree Type" ? (
                <DegreeBadge type={form.degreeType} />
              ) : (
                <span className="font-bold text-[var(--university-muted)]">{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </article>
    </ProgramSideCard>
  );
};

export default ProgramPreviewCard;
