import React, { useEffect, useMemo, useState } from "react";
import { Bell, MoreVertical } from "lucide-react";
import { getRecentNotices } from "../../../../services/dashboardService";

const recentNotices = [
  {
    title: "Semester registration window opened",
    meta: "Academic Office",
    time: "Today",
    tone: "blue",
  },
  {
    title: "Library access schedule updated",
    meta: "Central Library",
    time: "Yesterday",
    tone: "gold",
  },
  {
    title: "Faculty meeting minutes published",
    meta: "Administration",
    time: "2 days ago",
    tone: "sky",
  },
];

const noticeToneClasses = {
  blue: "bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]",
  gold: "bg-[color-mix(in_srgb,var(--university-gold)_22%,white)] text-[var(--university-ink)]",
  sky: "bg-[color-mix(in_srgb,var(--university-sky)_14%,white)] text-[var(--university-blue-dark)]",
};

const panelClassName =
  "flex h-[430px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm";

const panelScrollClassName =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--university-border)_transparent]";

const RecentNotices = () => {
  const [apiNotices, setApiNotices] = useState(null);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const { data } = await getRecentNotices();
        setApiNotices(data.notices || []);
      } catch {
        setApiNotices(null);
      }
    };

    loadNotices();
  }, []);

  const notices = useMemo(() => {
    if (!apiNotices) {
      return recentNotices;
    }

    return apiNotices.map((notice, index) => ({
      title: notice.title,
      meta:
        notice.createdBy?.fullName ||
        [notice.createdBy?.firstName, notice.createdBy?.lastName]
          .filter(Boolean)
          .join(" ") ||
        "Administration",
      time: notice.publishedAt
        ? new Date(notice.publishedAt).toLocaleDateString()
        : "Recently",
      tone: ["blue", "gold", "sky"][index % 3],
    }));
  }, [apiNotices]);

  return (
    <div className={panelClassName}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]">
            <Bell size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[var(--university-ink)]">
              Recent Notices
            </h2>
            <p className="mt-0.5 truncate text-xs font-medium text-[var(--university-muted)]">
              Latest published announcements
            </p>
          </div>
        </div>

        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]">
          <MoreVertical size={17} />
        </button>
      </div>

      <div className={`${panelScrollClassName} space-y-1 p-3 sm:p-4`}>
        {notices.map((notice) => (
          <div
            key={notice.title}
            className="flex min-w-0 gap-3 rounded-xl p-2.5 transition hover:bg-[var(--university-surface-soft)]"
          >
            <div
              className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                noticeToneClasses[notice.tone]
              }`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between lg:flex-col xl:flex-row">
                <p className="min-w-0 text-sm font-semibold leading-5 text-[var(--university-ink)]">
                  {notice.title}
                </p>
                <span className="w-fit shrink-0 rounded-full bg-[var(--university-surface-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--university-blue-dark)]">
                  {notice.time}
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">
                {notice.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotices;
