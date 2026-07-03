import { Building2, GraduationCap, UserCheck, UserX } from "lucide-react";

const SchoolStatCard = ({ total = 0, programs = 0, active = 0, inactive = 0 }) => {
  const stats = [
    {
      title: "Total Schools",
      value: total,
      hint: "from academic setup",
      icon: Building2,
      tone: "blue",
    },
    {
      title: "Total Programs",
      value: programs,
      hint: "linked programs",
      icon: GraduationCap,
      tone: "violet",
    },
    {
      title: "Active Schools",
      value: active,
      hint: "ready for assignment",
      icon: UserCheck,
      tone: "green",
    },
    {
      title: "Inactive Schools",
      value: inactive,
      hint: "soft deleted or paused",
      icon: UserX,
      tone: "orange",
    },
  ];

  const toneClass = {
    blue: "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]",
    violet: "bg-violet-50 text-violet-600",
    green: "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="min-h-32 rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${toneClass[stat.tone]}`}
            >
              <stat.icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-3xl font-bold leading-none text-[var(--university-ink)]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--university-ink)]">
                {stat.title}
              </p>
            </div>
          </div>
          <p className="mt-4 pl-[4.5rem] text-xs font-medium text-[var(--university-muted)]">
            {stat.hint}
          </p>
        </div>
      ))}
    </section>
  );
};

export default SchoolStatCard;
