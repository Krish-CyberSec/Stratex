import React from "react";

const NotificationLoadingState = () => {
  return (
    <div className="flex min-h-80 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--university-border)] border-t-[var(--university-blue)]" />
    </div>
  );
};

export default NotificationLoadingState;
