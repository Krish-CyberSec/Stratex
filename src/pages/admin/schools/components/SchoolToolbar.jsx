import { Grid2X2, List, RefreshCw, Search, SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Newest first", value: "createdAt:desc" },
  { label: "Oldest first", value: "createdAt:asc" },
  { label: "Status", value: "status:asc" },
];

const SchoolToolbar = ({
  filters,
  loading,
  onChange,
  onRefresh,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white p-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_190px]">
          <label className="relative min-w-0">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]"
            />
            <input
              value={filters.search}
              onChange={(event) => onChange("search", event.target.value)}
              placeholder="Search schools..."
              className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white pl-10 pr-3 text-sm font-medium text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
            />
          </label>

          <select
            value={filters.status}
            onChange={(event) => onChange("status", event.target.value)}
            className="h-11 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
          >
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={`${filters.sortBy}:${filters.order}`}
            onChange={(event) => {
              const [sortBy, order] = event.target.value.split(":");
              onChange("sort", { sortBy, order });
            }}
            className="h-11 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <div className="flex rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-1">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-white text-[var(--stratex-blue)] shadow-sm"
                  : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
              }`}
              title="Grid view"
            >
              <Grid2X2 size={17} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                viewMode === "list"
                  ? "bg-white text-[var(--stratex-blue)] shadow-sm"
                  : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
              }`}
              title="List view"
            >
              <List size={17} />
            </button>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]"
            title="Filters"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolToolbar;
