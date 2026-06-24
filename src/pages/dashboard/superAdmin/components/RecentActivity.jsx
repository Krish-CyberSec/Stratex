import React, { useEffect, useMemo, useState } from "react";
import { Activity, MoreVertical } from "lucide-react";
import { getRecentActivities } from "../../../../services/dashboardService";

const recentActivities = [
  {
    name: "Aarav Sharma",
    detail: "Added a new school profile",
    time: "Just now",
    reference: "SCH-024",
  },
  {
    name: "Meera Nair",
    detail: "Updated program details",
    time: "15 minutes ago",
    reference: "PRG-084",
  },
  {
    name: "Rohan Verma",
    detail: "Published a new notice",
    time: "1 hour ago",
    reference: "NOT-018",
  },
  {
    name: "Ananya Iyer",
    detail: "Scheduled an upcoming event",
    time: "2 hours ago",
    reference: "EVT-012",
  },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

const getFullName = (user) =>
  user?.fullName ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ");

const getRelativeDate = (date) =>
  date ? new Date(date).toLocaleString() : "Recently";

const panelClassName =
  "flex h-[430px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm";

const panelScrollClassName =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--university-border)_transparent]";

const RecentActivity = () => {
  const [apiActivities, setApiActivities] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const { data } = await getRecentActivities();
        setApiActivities(data.activities || []);
      } catch {
        setApiActivities(null);
      }
    };

    loadActivities();
  }, []);

  const activities = useMemo(() => {
    if (!apiActivities) {
      return recentActivities;
    }

    return apiActivities.map((activity) => ({
      name: getFullName(activity.performedBy) || "System",
      detail: activity.remarks || `${activity.action} in ${activity.module}`,
      time: getRelativeDate(activity.createdAt),
      reference: activity.module || activity.action,
    }));
  }, [apiActivities]);

  return (
    <div className={panelClassName}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-gold)_24%,white)] text-[var(--university-ink)]">
            <Activity size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--university-ink)]">
              Recent Activity
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
              Latest administrative updates
            </p>
          </div>
        </div>

        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]">
          <MoreVertical size={17} />
        </button>
      </div>

      <div className={`${panelScrollClassName} space-y-1 p-3 sm:p-4`}>
        {activities.map((activity) => (
          <div
            key={`${activity.reference}-${activity.time}-${activity.detail}`}
            className="flex min-w-0 gap-3 rounded-xl p-2.5 transition hover:bg-[var(--university-surface-soft)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-sm font-semibold text-[var(--university-blue-dark)]">
              {getInitials(activity.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--university-ink)]">
                    {activity.name}
                  </p>
                  <p className="text-xs font-medium text-[var(--university-muted)]">
                    {activity.detail}
                  </p>
                </div>

                <span className="w-fit shrink-0 rounded-full bg-[var(--university-surface-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--university-blue-dark)]">
                  {activity.reference}
                </span>
              </div>

              <p className="mt-1 text-xs text-[var(--university-muted)]">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
