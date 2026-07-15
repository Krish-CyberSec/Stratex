import { BarChart3, BookOpen, CalendarDays, Download, Eye, GraduationCap, Layers, ListChecks, PlusCircle } from "lucide-react";
import DegreeBadge from "../DegreeBadge";
import ProgramStatusBadge from "../ProgramStatusBadge";
import { formatDateTime, getSchoolName } from "./programDetailUtils";

const ProgramOverviewSide = ({ program, subjects, semesters }) => {
  const activeSubjects = subjects.filter((subject) => subject.status !== "inactive").length;

  const overviewRows = [
    { label: "Program Code", value: program.code || "Auto generated", icon: BookOpen },
    { label: "School", value: getSchoolName(program), icon: GraduationCap },
    { label: "Degree Type", value: program.degreeType, icon: Layers, badge: "degree" },
    { label: "Duration", value: `${program.duration || 0} Years`, icon: CalendarDays },
    { label: "Total Semesters", value: semesters.length, icon: ListChecks },
    { label: "Status", value: program.status, icon: Eye, badge: "status" },
    { label: "Last Updated", value: formatDateTime(program.updatedAt || program.createdAt), icon: BarChart3 },
  ];

  return (
    <aside className="min-w-0 space-y-4 xl:sticky xl:top-24 xl:self-start">
      <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--university-ink)]">Program Overview</h2>
        <div className="mt-4 space-y-3">
          {overviewRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex min-w-0 items-center gap-2 font-bold text-[var(--university-muted)]">
                <row.icon size={14} className="shrink-0 text-[var(--stratex-blue)]" />
                <span className="truncate">{row.label}</span>
              </span>
              <span className="max-w-[55%] truncate text-right font-bold text-[var(--university-ink)]">
                {row.badge === "degree" ? <DegreeBadge type={row.value} /> : row.badge === "status" ? <ProgramStatusBadge status={row.value} /> : row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--university-ink)]">Semester Overview</h2>
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[10px] border-green-400 bg-white">
            <div className="text-center">
              <p className="text-2xl font-black text-[var(--university-ink)]">{semesters.length}</p>
              <p className="text-[10px] font-bold text-[var(--university-muted)]">Total</p>
            </div>
          </div>
          <div className="space-y-2 text-xs font-bold text-[var(--university-muted)]">
            <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />{semesters.length} Active</p>
            <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-400" />0 Inactive</p>
            <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />{activeSubjects} Subjects</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--university-ink)]">Quick Actions</h2>
        <div className="mt-3 divide-y divide-[var(--border-light)]">
          {[
            { label: "Manage Subjects", hint: "Add and manage subjects for this program", icon: ListChecks },
            { label: "View Program Analytics", hint: "View enrollment and performance analysis", icon: BarChart3 },
            { label: "Create Program", hint: "Create a copy of this program", icon: PlusCircle },
            { label: "Export Program Data", hint: "Download program information", icon: Download },
          ].map((action) => (
            <button key={action.label} type="button" className="flex w-full items-center gap-3 py-3 text-left transition hover:text-[var(--stratex-blue)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--stratex-blue)]">
                <action.icon size={15} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-[var(--university-ink)]">{action.label}</span>
                <span className="block truncate text-[11px] font-medium text-[var(--university-muted)]">{action.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default ProgramOverviewSide;
