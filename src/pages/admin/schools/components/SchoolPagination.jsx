import { ChevronLeft, ChevronRight } from "lucide-react";

const getVisiblePages = (current = 1, total = 1) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
};

const SchoolPagination = ({ pagination, onPageChange, pageSize, onPageSizeChange }) => {
  const page = pagination?.page || 1;
  const totalPages = Math.max(pagination?.totalPages || 1, 1);
  const total = pagination?.total || 0;
  const count = pagination?.count || 0;
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = total ? first + count - 1 : 0;
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-3 px-1 py-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[var(--university-muted)]">
        Showing {first} to {last} of {total} schools
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination?.hasPrevPage}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)] disabled:cursor-not-allowed disabled:opacity-45"
          title="Previous page"
        >
          <ChevronLeft size={17} />
        </button>

        {visiblePages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
              item === page
                ? "border-[var(--stratex-blue)] bg-[var(--stratex-blue)] text-white"
                : "border-[var(--border-light)] bg-white text-[var(--university-muted)] hover:text-[var(--university-ink)]"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination?.hasNextPage}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)] disabled:cursor-not-allowed disabled:opacity-45"
          title="Next page"
        >
          <ChevronRight size={17} />
        </button>

        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-10 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none focus:border-[var(--university-blue)]"
        >
          {[8, 12, 16, 24].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SchoolPagination;
