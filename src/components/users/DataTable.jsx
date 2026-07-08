import { ChevronLeft, ChevronRight } from "lucide-react";

const getVisiblePages = (current = 1, total = 1) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
};

const Datatable = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  pageSize = 10,
  itemCount = 0,
  itemLabel = "users",
  className = "",
}) => {
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const first = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const last = totalItems ? first + itemCount - 1 : 0;
  const visiblePages = getVisiblePages(currentPage, safeTotalPages);

  const handlePageChange = (page) => {
    if (!onPageChange) return;

    const safePage = Math.max(1, Math.min(safeTotalPages, page));

    if (safePage !== currentPage) {
      onPageChange(safePage);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 px-1 py-1 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-sm font-semibold text-[var(--university-muted)]">
        Showing {first} to {last} of {totalItems} {itemLabel}
      </p>

      {safeTotalPages > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)] disabled:cursor-not-allowed disabled:opacity-45"
            title="Previous page"
          >
            <ChevronLeft size={17} />
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
                page === currentPage
                  ? "border-[var(--stratex-blue)] bg-[var(--stratex-blue)] text-white"
                  : "border-[var(--border-light)] bg-white text-[var(--university-muted)] hover:text-[var(--university-ink)]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === safeTotalPages}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:text-[var(--university-ink)] disabled:cursor-not-allowed disabled:opacity-45"
            title="Next page"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Datatable;
