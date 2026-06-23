import React, { useEffect, useMemo, useState } from "react";
import DashboardStatCard from "../../../../components/common/DashboardStatCard";
import { getDashboardStats } from "../../../../services/dashboardService";

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
    title: "Users",
    value: "32",
    trend: "Across all programs",
    className:
      "bg-[var(--university-surface)] border-[var(--university-border)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[var(--university-border)] text-[var(--university-blue-dark)] hover:bg-[var(--university-surface-soft)]",
  },
  {
    title: "Programs",
    value: "84",
    trend: "Currently available",
    className:
      "bg-[var(--university-surface-soft)] border-[var(--university-border)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[var(--university-border)] text-[var(--university-blue-dark)] hover:bg-[var(--university-surface)]",
  },
  {
    title: "Subjects",
    value: "216",
    trend: "Mapped to programs",
    className:
      "bg-[color-mix(in_srgb,var(--university-sky)_12%,white)] border-[var(--university-border)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[var(--university-border)] text-[var(--university-blue-dark)] hover:bg-[color-mix(in_srgb,var(--university-sky)_18%,white)]",
  },
  {
    title: "Notices",
    value: "18",
    trend: "Published notices",
    className:
      "bg-[color-mix(in_srgb,var(--university-gold)_14%,white)] border-[color-mix(in_srgb,var(--university-gold)_34%,white)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[color-mix(in_srgb,var(--university-gold)_46%,white)] text-[var(--university-blue-dark)] hover:bg-[color-mix(in_srgb,var(--university-gold)_22%,white)]",
  },
  {
    title: "Events",
    value: "12",
    trend: "Upcoming events",
    className:
      "bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] border-[var(--university-border)] text-[var(--university-ink)]",
    titleClassName: "text-[var(--university-blue-dark)]",
    valueClassName: "text-[var(--university-ink)]",
    trendClassName: "text-[var(--university-blue-dark)]",
    actionClassName:
      "border-[var(--university-border)] text-[var(--university-blue-dark)] hover:bg-[color-mix(in_srgb,var(--university-blue)_16%,white)]",
  },
];

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch {
        setStats(null);
      }
    };

    loadStats();
  }, []);

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
    <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
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

export default DashboardStats;
