import { ChevronLeft, ChevronRight } from "lucide-react";

const ProgramPagination = ({ limit, onLimitChange, onPageChange, page, total, totalPages }) => {
  return (
    <div className="flex flex-col gap-3 rounded-b-xl border-t border-[var(--border-light)] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-[var(--university-muted)]">
        Showing {total ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} programs
      </p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--university-muted)] disabled:opacity-45">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 4) }).map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-bold ${page === pageNumber ? "bg-[var(--stratex-blue)] text-white" : "border border-[var(--border)] bg-white text-[var(--university-ink)]"}`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--university-muted)] disabled:opacity-45">
          <ChevronRight size={16} />
        </button>
        <select value={limit} onChange={(event) => onLimitChange(Number(event.target.value))} className="ml-2 h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-xs font-bold text-[var(--university-ink)]">
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  );
};

export default ProgramPagination;

