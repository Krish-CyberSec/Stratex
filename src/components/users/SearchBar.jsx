import { Search } from "lucide-react";

const SearchBar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  roleFilter = "all",
  setRoleFilter = () => {},
  sortBy = "name",
  setSortBy = () => {},
}) => {
  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white p-3 shadow-sm">
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
          className="h-11 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
        >
          <option value="all">Role: All</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="schoolAdmin">School Admin</option>
          <option value="coordinator">Coordinator</option>
          <option value="examCell">Exam Cell</option>
          <option value="superAdmin">Super Admin</option>
        </select>

        <select
          aria-label="Sort users"
          id="sort-users"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-11 rounded-xl border border-[var(--border-light)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
        >
          <option value="name">Sort by: Name (A-Z)</option>
          <option value="createdAt">Sort by: Newest first</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
