import React, { useEffect, useMemo, useState } from "react";
import DashboardStatCard from "../../../../components/common/DashboardStatCard";
const dashboardStats = [
  {
    title: "Total Schools",
    value: "24",
    trend: "Increased from last month",
    className:
      "bg-[var(--university-blue)] border-[var(--university-blue)] text-white",
    titleClassName: "text-white/80",
    valueClassName: "text-white",
    trendClassName: "text-white/80",
    actionClassName: "border-white/30 text-white hover:bg-white/10",
  },
  {
    title: "Total Admins",
    value: "32",
    trend: "Across all the scholls ",
    className:
      "bg-[var(--university-surface)] border-[var(--university-border)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[var(--university-border)] text-[var(--university-blue-dark)] hover:bg-[var(--university-surface-soft)]",
  },
  {
    title: "Total Coordinators",
    value: "84",
    trend: "Across all the scholls",
    className:
      "bg-[var(--university-surface-soft)] border-[var(--university-border)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[var(--university-border)] text-[var(--university-blue-dark)] hover:bg-[var(--university-surface)]",
  }
];

const SchoolStatCard = () => {
  const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         const { data } = await getDashboardStats();
//         setStats(data);
//       } catch {
//         setStats(null);
//       }
//     };

//     loadStats();
//   }, []);

  const renderedStats = useMemo(() => {
    const values = {
      "Total Schools": stats?.totalSchools,
      Users: stats?.totalUsers,
      Programs: stats?.totalPrograms,
      Subjects: stats?.totalSubjects,
      Notices: stats?.totalNotices,
      Events: stats?.totalEvents,
    };

    return dashboardStats.map((stat) => ({
      ...stat,
      value:
        values[stat.title] !== undefined
          ? String(values[stat.title])
          : stat.value,
    }));
  }, [stats]);

  return (
    <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {renderedStats.map((stat) => (
        <DashboardStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          className={`min-w-0 rounded-2xl ${stat.className}`}
          titleClassName={stat.titleClassName}
          valueClassName={`text-3xl sm:text-4xl ${stat.valueClassName}`}
          trendClassName={stat.trendClassName}
          actionClassName={stat.actionClassName}
        />
      ))}
    </section>
  );
};

export default SchoolStatCard;
