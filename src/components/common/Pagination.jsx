import { ChevronLeft, ChevronRight } from "lucide-react";

const getVisiblePages = (current = 1, total = 1) => {
  const page = Math.max(current, 1);
  const totalPages = Math.max(total, 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);

  return [...pages]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
};

const Pagination = ({
  className = "",
  count,
  itemLabel = "records",
  onPageChange,
  onPageSizeChange,
  page = 1,
  pageSize = 10,
  pageSizeOptions = [8, 12, 16, 24],
  total = 0,
  totalPages,
}) => {
  const safeTotal = Math.max(Number(total) || 0, 0);
  const safePageSize = Math.max(Number(pageSize) || 1, 1);
  const safeTotalPages = Math.max(Number(totalPages) || Math.ceil(safeTotal / safePageSize) || 1, 1);
  const safePage = Math.min(Math.max(Number(page) || 1, 1), safeTotalPages);
  const shownCount = count ?? Math.min(safePageSize, Math.max(safeTotal - (safePage - 1) * safePageSize, 0));
  const first = safeTotal ? (safePage - 1) * safePageSize + 1 : 0;
  const last = safeTotal ? first + Math.max(shownCount, 0) - 1 : 0;
  const visiblePages = getVisiblePages(safePage, safeTotalPages);

  if (!safeTotal) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-3 px-1 py-1 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <p className="text-sm font-semibold text-[var(--university-muted)]">
        Showing {first} to {last} of {safeTotal} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
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
              item === safePage
                ? "border-[var(--stratex-blue)] bg-[var(--stratex-blue)] text-white"
                : "border-[var(--border-light)] bg-white text-[var(--university-muted)] hover:text-[var(--university-ink)]"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= safeTotalPages}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)] disabled:cursor-not-allowed disabled:opacity-45"
          title="Next page"
        >
          <ChevronRight size={17} />
        </button>

        {onPageSizeChange ? (
          <select
            value={safePageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-10 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none focus:border-[var(--university-blue)]"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        ) : null}
      </div>
    </div>
  );
};

export default Pagination;
