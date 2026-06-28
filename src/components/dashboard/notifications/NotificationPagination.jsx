import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NotificationPagination = ({ onPageChange, pagination }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--university-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-[var(--university-muted)]">
        Page {pagination.page} of {pagination.totalPages}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--university-border)] px-3 py-2 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--university-border)] px-3 py-2 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationPagination;
