import { Filter, Search } from "lucide-react";

const ProgramFilters = ({
  degreeType,
  onDegreeTypeChange,
  onSchoolChange,
  onSearchChange,
  onStatusChange,
  schoolId,
  schools,
  search,
  status,
}) => {
  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_220px_180px_180px_auto] lg:items-end">
        <label className="block">
          <span className="sr-only">Search programs</span>
          <span className="relative block">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search programs by name..."
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-white pl-10 pr-3 text-sm font-medium text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_12%,white)]"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[var(--university-ink)]">School</span>
          <select
            value={schoolId}
            onChange={(event) => onSchoolChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none focus:border-[var(--stratex-blue)]"
          >
            <option value="">All Schools</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[var(--university-ink)]">Degree Type</span>
          <select
            value={degreeType}
            onChange={(event) => onDegreeTypeChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none focus:border-[var(--stratex-blue)]"
          >
            <option value="">All Types</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="Diploma">Diploma</option>
            <option value="PhD">PhD</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[var(--university-ink)]">Status</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none focus:border-[var(--stratex-blue)]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>
    </section>
  );
};

export default ProgramFilters;

