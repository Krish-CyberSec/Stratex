import { CalendarDays, GraduationCap, TrendingUp, UserRoundCheck } from "lucide-react";

const metrics = [
  {
    key: "program",
    icon: GraduationCap,
    label: "My Course",
    tone: "bg-[#eef2ff] text-[#4f46e5]",
  },
  {
    key: "semester",
    icon: CalendarDays,
    label: "Current Semester",
    tone: "bg-[#eef2ff] text-[#4f46e5]",
  },
  {
    key: "cgpa",
    icon: TrendingUp,
    label: "CGPA",
    tone: "bg-[#ecfdf5] text-[#16a34a]",
  },
  {
    key: "attendance",
    icon: UserRoundCheck,
    label: "Attendance",
    tone: "bg-[#ecfdf5] text-[#10b981]",
  },
];

const getMetricContent = (metric, student, data) => {
  if (metric.key === "program") {
    const programName = student?.program?.name || student?.program?.code || "Not assigned";
    const specializationName = student?.specialization?.name;
    const courseName = specializationName ? `${programName} - ${specializationName}` : `${programName} - Core`;

    return {
      value: student?.program ? student?.program?.code || student?.program?.degreeType || "Course" : "Not assigned",
      helper: student?.program ? courseName : "Course assignment pending",
    };
  }

  if (metric.key === "semester") {
    return {
      value: student?.semesterLabel || "Not assigned",
      helper: student?.termLabel || "Current term",
    };
  }

  if (metric.key === "cgpa") {
    return {
      value: data?.metrics?.cgpa ?? "Unavailable",
      helper: "Results integration is not enabled",
      helperTone: "text-[#64748b]",
    };
  }

  return {
    value: data?.metrics?.attendance ?? "Unavailable",
    helper: "Attendance integration is not enabled",
    helperTone: "text-[#64748b]",
  };
};

const StudentMetricGrid = ({ data }) => {
  const student = data?.student || {};

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const content = getMetricContent(metric, student, data);

        return (
          <article key={metric.key} className="h-[132px] overflow-hidden rounded-xl border border-[#e8eef7] bg-white p-5 shadow-[0_8px_24px_rgba(15,39,68,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,39,68,0.08)]">
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${metric.tone}`}>
                <Icon size={21} strokeWidth={2.45} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-black text-[#64748b]">{metric.label}</p>
                  {content.badge ? (
                    <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-black text-[#64748b]">
                      {content.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 truncate text-xl font-black text-[#172554] sm:text-2xl">{content.value}</p>
                <p className={`mt-1 line-clamp-2 text-xs font-bold leading-5 ${content.helperTone || "text-[#64748b]"}`}>
                  {content.helper}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default StudentMetricGrid;
