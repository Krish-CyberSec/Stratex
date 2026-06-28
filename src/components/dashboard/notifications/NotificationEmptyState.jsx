import React from "react";
import { Inbox } from "lucide-react";

const NotificationEmptyState = () => {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--university-surface-soft)] text-[var(--university-blue-dark)]">
        <Inbox size={24} />
      </div>
      <h3 className="text-base font-semibold text-[var(--university-ink)]">
        No notifications found
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--university-muted)]">
        New notifications will appear here when they are delivered to your
        account.
      </p>
    </div>
  );
};

export default NotificationEmptyState;
