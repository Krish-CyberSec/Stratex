import { useEffect } from "react";
import { Grid2X2, List, Search, RefreshCw } from "lucide-react";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "schoolAdmin", label: "School Admin" },
  { value: "coordinator", label: "Coordinator" },
  { value: "examCell", label: "Exam Cell" },
];

const SearchBar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  roleFilter = "all",
  setRoleFilter = () => {},
  sortBy = "name",
  setSortBy = () => {},
  viewMode = "list",
  onViewModeChange,
  onRefresh,
  loading = false,
}) => {
  useEffect(() => {
    if (roleFilter === "superAdmin") {
      setRoleFilter("all");
    }
  }, [roleFilter, setRoleFilter]);

  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white p-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_170px_190px]">
          <label className="relative min-w-0">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]"
            />
            <input
              type="text"
              id="user-search"
              aria-label="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="h-11 w-full rounded-xl border border-[var(--border-light)] bg-white pl-10 pr-3 text-sm font-medium text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
            />
          </label>

          <select
            aria-label="Filter by role"
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-11 cursor-pointer rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
          >
            <option value="all">Role: All</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort users"
            id="sort-users"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 cursor-pointer rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
          >
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="createdAt">Sort by: Newest first</option>
          </select>
        </div>

        {onViewModeChange && (
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-1">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white text-[var(--stratex-blue)] shadow-sm"
                    : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
                }`}
                title="Card view"
              >
                <Grid2X2 size={17} />
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition ${
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
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-semibold text-[var(--university-ink)] transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
