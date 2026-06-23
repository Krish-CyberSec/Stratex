import React from "react";
import {
  Activity,
  FilePlus2,
  MoreVertical,
  Send,
  Settings2,
  UserPlus,
} from "lucide-react";

const quickActions = [
  {
    label: "Add User",
    helper: "Create admin, faculty, or student access",
    icon: UserPlus,
  },
  {
    label: "Post Notice",
    helper: "Publish an announcement",
    icon: Send,
  },
  {
    label: "Create Event",
    helper: "Schedule a campus activity",
    icon: FilePlus2,
  },
  {
    label: "Manage Settings",
    helper: "Update dashboard controls",
    icon: Settings2,
  },
];

const QuickActions = () => {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-sky)_14%,white)] text-[var(--university-blue-dark)]">
            <Activity size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[var(--university-ink)]">
              Quick Actions
            </h2>
            <p className="mt-0.5 truncate text-xs font-medium text-[var(--university-muted)]">
              Common admin shortcuts
            </p>
          </div>
        </div>

        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]">
          <MoreVertical size={17} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-1 xl:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              className="group flex min-h-[92px] min-w-0 flex-col items-start justify-between rounded-xl border border-[var(--university-border)] bg-[var(--university-surface)] p-3 text-left transition hover:border-[var(--university-blue)] hover:bg-[var(--university-surface-soft)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)] transition group-hover:bg-[var(--university-blue)] group-hover:text-white">
                <Icon size={17} />
              </span>

              <span className="mt-3 min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--university-ink)]">
                  {action.label}
                </span>
                <span className="mt-0.5 block text-xs leading-4 text-[var(--university-muted)]">
                  {action.helper}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
