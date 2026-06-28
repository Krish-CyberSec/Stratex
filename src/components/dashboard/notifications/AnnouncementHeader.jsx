import React from "react";
import { CheckCheck, Trash2 } from "lucide-react";

const AnnouncementHeader = ({
  actionLoading,
  canClear,
  eyebrow = "Student Workspace",
  onClearAll,
  onMarkAllRead,
  title = "Announcements",
  unreadCount,
}) => {
  return (
    <header className="mb-6 border-b border-[var(--university-border)] pb-6 pt-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--university-muted)]">
            {eyebrow}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--university-ink)]">
              {title}
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[var(--success)] px-3 py-1 text-xs font-semibold text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--university-muted)]">
            Stay updated with official program news, mentor notes, deadlines,
            and important schedule changes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={!unreadCount || actionLoading === "read-all"}
            className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--university-surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>

          <button
            type="button"
            onClick={onClearAll}
            disabled={!canClear || actionLoading === "clear-all"}
            className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--university-blue-dark)] shadow-sm transition hover:border-[var(--university-blue)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={17} />
            Clear all
          </button>
        </div>
      </div>
    </header>
  );
};

export default AnnouncementHeader;
