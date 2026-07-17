import { memo, useCallback, useEffect, useState } from "react";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const toOption = (item) => ({
  value: item._id || item.id || item.value,
  label: item.name || item.label || "Untitled",
});

const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const Field = memo(({ label, children }) => (
  <label className="min-w-0">
    <span className="mb-1.5 block text-[11px] font-black text-[var(--university-muted)]">
      {label}
    </span>
    {children}
  </label>
));

const SelectField = memo(
  ({
    label,
    name,
    value,
    onChange,
    options,
    allLabel,
    disabled,
    includeAll = true,
  }) => (
    <Field label={label} id={name}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-10 w-full cursor-pointer rounded-xl border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)] disabled:cursor-not-allowed disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]"
      >
        {includeAll && <option value="all">{allLabel}</option>}
        {options.map((option) => {
          const normalized = toOption(option);

          return (
            <option key={normalized.value} value={normalized.value}>
              {normalized.label}
            </option>
          );
        })}
      </select>
    </Field>
  ),
);

const SearchBar = ({
  filters,
  onChange,
  onReset,
  roleOptions = [],
  schoolOptions = [],
  programOptions = [],
  specializationOptions = [],
  semesterOptions = [],
  statusOptions = [],
  sortOptions = [],
  loading = false,
  activeFilterCount = 0,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const updateFilter = useCallback(
    (key, value) => {
      onChange({ ...filters, [key]: value });
    },
    [filters, onChange],
  );

  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filters.search, updateFilter]);

  const handleReset = useCallback(() => {
    setSearchInput("");
    onReset?.();
  }, [onReset]);

  const handleApply = useCallback(() => {
    onChange({ ...filters, search: searchInput });
  }, [filters, onChange, searchInput]);

  return (
    <section className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
            <SlidersHorizontal size={17} />
          </span>
          <div>
            <h2 className="text-sm font-black text-[var(--university-ink)]">
              Filters
            </h2>
            <p className="text-xs font-semibold text-[var(--university-muted)]">
              {activeFilterCount
                ? `${activeFilterCount} active filter(s)`
                : "Search, segment, and sort users"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-xs font-black text-[var(--university-ink)] transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--university-blue)] px-4 text-xs font-black text-white transition hover:bg-[var(--university-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Filter size={15} />
            Apply Filters
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <Field label="Search" id="search">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]"
            />
            <input
              id="search"
              type="search"
              aria-label="Search users"
              name="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, email, or ID..."
              className="h-10 w-full rounded-xl border border-[var(--border-light)] bg-white pl-10 pr-3 text-xs font-bold text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_14%,white)]"
            />
          </div>
        </Field>

        <SelectField
          name="role"
          label="Role"
          value={filters.role}
          onChange={(value) => updateFilter("role", value)}
          options={roleOptions.map((role) => ({
            value: role.value,
            label: role.label,
          }))}
          allLabel="All Roles"
          disabled={loading}
        />
        <SelectField
          name="schoolId"
          label="School"
          value={filters.schoolId}
          onChange={(value) => updateFilter("schoolId", value)}
          options={schoolOptions}
          allLabel="All Schools"
          disabled={loading}
        />
        <SelectField
          label="Program"
          name="programId"
          value={filters.programId}
          onChange={(value) => updateFilter("programId", value)}
          options={programOptions}
          allLabel="All Programs"
          disabled={loading}
        />
        <SelectField
          name="semesterId"
          label="Semester"
          value={filters.semesterId}
          onChange={(value) => updateFilter("semesterId", value)}
          options={semesterOptions}
          allLabel="All Semesters"
          disabled={loading || semesterOptions.length === 0}
        />
        <SelectField
          name="specializationId"
          label="Specialization"
          value={filters.specializationId}
          onChange={(value) => updateFilter("specializationId", value)}
          options={specializationOptions}
          allLabel="All Specializations"
          disabled={loading}
        />
        <SelectField
          name="status"
          label="Status"
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={statusOptions}
          allLabel="All Status"
          disabled={loading}
        />
        <SelectField
          name="sortBy"
          label="Sort By"
          value={filters.sortBy}
          onChange={(value) => updateFilter("sortBy", value)}
          options={sortOptions}
          allLabel="Sort Field"
          includeAll={false}
          disabled={loading}
        />
        <SelectField
          name="order"
          label="Order"
          value={filters.order}
          onChange={(value) => updateFilter("order", value)}
          options={[
            { value: "desc", label: "Descending" },
            { value: "asc", label: "Ascending" },
          ]}
          allLabel="Default"
          includeAll={false}
          disabled={loading}
        />
      </div>
    </section>
  );
};

export default memo(SearchBar);