import { BookOpen, CalendarDays, Clock, GraduationCap, Hash, Landmark, Layers, UserRound } from "lucide-react";
import { formatDateTime, getPersonName, getSchoolName } from "./programDetailUtils";

const metaItems = (program) => [
  { label: "Program Code", value: program.code || program.slug || "Auto generated", icon: Hash },
  { label: "School", value: getSchoolName(program), icon: Landmark },
  { label: "Degree Type", value: program.degreeType || "Not set", icon: GraduationCap },
  { label: "Duration", value: `${program.duration || 0} Years`, icon: CalendarDays },
  { label: "Total Semesters", value: `${Number(program.duration || 0) * 2} Generated`, icon: Layers },
  { label: "Status", value: program.status || "active", icon: BookOpen },
  { label: "Created By", value: getPersonName(program.createdBy), icon: UserRound },
  { label: "Created At", value: formatDateTime(program.createdAt), icon: Clock },
];

const ProgramMetaGrid = ({ program }) => (
  <section className="grid gap-3 rounded-xl border border-[var(--border-light)] bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-4 sm:p-4">
    {metaItems(program).map((item) => (
      <div key={item.label} className="flex min-w-0 items-start gap-3 rounded-lg bg-[var(--surface-soft)] px-3 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--stratex-blue)] shadow-sm">
          <item.icon size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--university-muted)]">{item.label}</p>
          <p className="mt-1 truncate text-xs font-bold text-[var(--university-ink)]">{item.value}</p>
        </div>
      </div>
    ))}
  </section>
);

export default ProgramMetaGrid;
