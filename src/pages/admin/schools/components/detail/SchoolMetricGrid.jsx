import { Building2, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";

const SchoolMetricGrid = ({ counts, school }) => {
  const metrics = [
    { label: "Programs", value: counts.programs, icon: Building2, tone: "blue" },
    { label: "Faculty Members", value: counts.faculty, icon: UsersRound, tone: "green" },
    { label: "Students Enrolled", value: counts.students, icon: GraduationCap, tone: "orange" },
    { label: "Coordinators", value: counts.coordinators, icon: ShieldCheck, tone: "violet" },
  ];

  const tones = {
    blue: "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]",
    green: "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]",
    orange: "bg-orange-50 text-orange-500",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex min-h-20 items-center gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] px-3 sm:gap-4 sm:px-4"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[metric.tone]}`}>
            <metric.icon size={19} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-none text-[var(--university-ink)]">
              {metric.value ?? 0}
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">
              {metric.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchoolMetricGrid;
