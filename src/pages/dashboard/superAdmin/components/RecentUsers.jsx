import React from "react";
import { MoreVertical, UsersRound } from "lucide-react";

const recentUsers = [
  {
    name: "Aarav Sharma",
    role: "School Admin",
    school: "School of Engineering & Technology",
    createdBy: "John Doe",
    tone: "blue",
  },
  {
    name: "Meera Nair",
    role: "Faculty",
    school: "School of Management",
    createdBy: "Aarav Sharma",
    tone: "sky",
  },
  {
    name: "Rohan Verma",
    role: "Student Coordinator",
    school: "School of Computer Applications",
    createdBy: "Meera Nair",
    tone: "gold",
  },
  {
    name: "Ananya Iyer",
    role: "Program Admin",
    school: "School of Applied Sciences",
    createdBy: "John Doe",
    tone: "ink",
  },
];

const userToneClasses = {
  blue: {
    avatar:
      "bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]",
    role: "bg-[color-mix(in_srgb,var(--university-blue)_9%,white)] text-[var(--university-blue-dark)]",
  },
  sky: {
    avatar:
      "bg-[color-mix(in_srgb,var(--university-sky)_14%,white)] text-[var(--university-blue-dark)]",
    role: "bg-[color-mix(in_srgb,var(--university-sky)_11%,white)] text-[var(--university-blue-dark)]",
  },
  gold: {
    avatar:
      "bg-[color-mix(in_srgb,var(--university-gold)_22%,white)] text-[var(--university-ink)]",
    role: "bg-[color-mix(in_srgb,var(--university-gold)_18%,white)] text-[var(--university-ink)]",
  },
  ink: {
    avatar:
      "bg-[color-mix(in_srgb,var(--university-ink)_10%,white)] text-[var(--university-ink)]",
    role: "bg-[color-mix(in_srgb,var(--university-ink)_8%,white)] text-[var(--university-ink)]",
  },
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

const panelClassName =
  "flex h-[430px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] shadow-sm";

const panelScrollClassName =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--university-border)_transparent]";

const RecentUsers = () => {
  return (
    <div className={panelClassName}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] bg-[linear-gradient(180deg,var(--university-surface),var(--university-surface-soft))] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--university-blue)_12%,white)] text-[var(--university-blue-dark)]">
            <UsersRound size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--university-ink)]">
              Recent Users
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)]">
              Latest users added to the system
            </p>
          </div>
        </div>

        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--university-border)] text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]">
          <MoreVertical size={17} />
        </button>
      </div>

      <div className="hidden grid-cols-[1.05fr_0.72fr_1.12fr_0.72fr] border-b border-[var(--university-border)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)] md:grid">
        <span>Name</span>
        <span>Role</span>
        <span>School</span>
        <span>Created By</span>
      </div>

      <div
        className={`${panelScrollClassName} divide-y divide-[var(--university-border)] px-4 sm:px-5`}
      >
        {recentUsers.map((user) => (
          <div
            key={user.name}
            className="grid grid-cols-1 gap-3 py-4 text-sm transition md:grid-cols-[1.05fr_0.72fr_1.12fr_0.72fr] md:items-center"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  userToneClasses[user.tone].avatar
                }`}
              >
                {getInitials(user.name)}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--university-ink)]">
                  {user.name}
                </p>
                <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)] md:hidden">
                  {user.role}
                </p>
                <p className="mt-0.5 text-xs font-medium text-[var(--university-muted)] md:hidden">
                  Created by {user.createdBy}
                </p>
              </div>
            </div>

            <p
              className={`hidden w-fit rounded-full px-2.5 py-1 text-xs font-semibold md:block ${
                userToneClasses[user.tone].role
              }`}
            >
              {user.role}
            </p>

            <p className="min-w-0 leading-5 text-[var(--university-muted)]">
              {user.school}
            </p>

            <p className="hidden min-w-0 truncate text-sm font-medium text-[var(--university-muted)] md:block">
              {user.createdBy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
