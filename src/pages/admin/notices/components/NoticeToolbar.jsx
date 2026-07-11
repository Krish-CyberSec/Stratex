import { Filter, Plus, Search } from "lucide-react";

const tabs = [
  { label: "All Notices", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const NoticeToolbar = ({ activeStatus, canCreate, onCreate, onSearch, onStatusChange, search }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-max rounded-lg border border-[var(--border-light)] bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={`h-9 rounded-md px-4 text-xs font-black transition ${
              activeStatus === tab.value
                ? "bg-[var(--stratex-blue)] text-white shadow-sm"
                : "text-[var(--university-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--university-ink)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative block min-w-0 sm:w-72">
        <span className="sr-only">Search notices</span>
        <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search notices..."
          className="h-11 w-full rounded-lg border border-[var(--border-light)] bg-white pl-4 pr-10 text-sm font-semibold text-[var(--university-ink)] outline-none shadow-sm transition placeholder:text-[var(--university-muted)] focus:border-[var(--stratex-blue)]"
        />
      </label>

      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
      >
        <Filter size={16} />
        Filter
      </button>

      {canCreate ? (
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
        >
          <Plus size={17} />
          Create Notice
        </button>
      ) : null}
    </div>
  </div>
);

export default NoticeToolbar;
