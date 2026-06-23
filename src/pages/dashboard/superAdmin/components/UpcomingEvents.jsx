import React from "react";
import { CalendarDays, MoreVertical } from "lucide-react";

const upcomingEvents = [
  {
    title: "Research Review",
    date: "24 Jun",
    time: "10:00 AM",
    location: "Conference Hall",
  },
  {
    title: "Admissions Briefing",
    date: "26 Jun",
    time: "12:30 PM",
    location: "Main Auditorium",
  },
  {
    title: "Placement Orientation",
    date: "29 Jun",
    time: "02:00 PM",
    location: "Seminar Room 2",
  },
];

const panelClassName =
  "flex h-[430px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm";

const panelScrollClassName =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--university-border)_transparent]";

const UpcomingEvents = () => {
  return (
    <div className={panelClassName}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-gold)_24%,white)] text-[var(--university-ink)]">
            <CalendarDays size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[var(--university-ink)]">
              Upcoming Events
            </h2>
            <p className="mt-0.5 truncate text-xs font-medium text-[var(--university-muted)]">
              Scheduled campus activities
            </p>
          </div>
        </div>

        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]">
          <MoreVertical size={17} />
        </button>
      </div>

      <div className={`${panelScrollClassName} space-y-2 p-3 sm:p-4`}>
        {upcomingEvents.map((event) => (
          <div
            key={event.title}
            className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-xl p-2.5 transition hover:bg-[var(--university-surface-soft)]"
          >
            <div className="flex min-h-16 flex-col items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--university-gold)_34%,white)] bg-[color-mix(in_srgb,var(--university-gold)_12%,white)] px-2 text-center">
              <span className="text-sm font-semibold leading-4 text-[var(--university-ink)]">
                {event.date}
              </span>
            </div>

            <div className="min-w-0 self-center">
              <p className="truncate text-sm font-semibold text-[var(--university-ink)]">
                {event.title}
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">
                {event.time}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--university-muted)]">
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
