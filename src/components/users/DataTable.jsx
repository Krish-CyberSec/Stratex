const Datatable = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,

  showPageInfo = true,
  pageInfoText,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (!onPageChange) return;

    const safePage = Math.max(1, Math.min(totalPages, page));

    if (safePage !== currentPage) {
      onPageChange(safePage);
    }
  };

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis-start");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-end");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div
      className="
    flex
    flex-col
    gap-4
    border-t
    border-[var(--university-border)]
    px-4
    py-4
    sm:flex-row
    sm:items-center
    sm:justify-between
    sm:px-6
    sm:py-5
  "
    >
      {showPageInfo && (
        <p className="text-center text-xs text-[var(--text-secondary)] sm:text-left sm:text-sm">
          <span className="sm:hidden">
            {currentPage}/{totalPages}
          </span>

          <span className="hidden sm:inline">
            Page {currentPage} of {totalPages}
          </span>
        </p>
      )}
      <div
        className={`
    flex
    flex-wrap
    items-center
    justify-center
    gap-1
    sm:gap-2
    sm:justify-end
    min-w-fit
    ${className}
  `}
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="
            flex
            h-9
            w-9
            sm:h-10
            sm:w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--university-border)]
            bg-white
            transition-all
            md:hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:shadow-none
          "
        >
          ←
        </button>

        {pages.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={`${page}-${index}`}
                className="
                  flex
                  h-9
                  min-w-[32px]
                  sm:h-10
                  sm:min-w-[40px]
                  items-center
                  justify-center
                  text-[var(--text-secondary)]
                "
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => handlePageChange(page)}
              className={`
                flex
                h-9
                w-9
                sm:h-10
                sm:w-10
                items-center
                justify-center
                rounded-xl
                text-sm
                font-semibold
                transition-all
                ${
                  currentPage === page
                    ? `
                      bg-[var(--university-blue)]
                      text-white
                      shadow-md
                    `
                    : `
                      border
                      border-[var(--university-border)]
                      bg-white
                      md:hover:-translate-y-[1px]
                      md:hover:shadow-md
                    `
                }
              `}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="
            flex
            h-9
            w-9
            sm:h-10
            sm:w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--university-border)]
            bg-white
            transition-all
            md:hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:shadow-none
          "
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Datatable;
