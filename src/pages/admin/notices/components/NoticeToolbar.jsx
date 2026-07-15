import { Filter, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const tabs = [
  { label: "All Notices", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Read", value: "read" },
  { label: "Unread", value: "unread" },
];

const getCreatorId = (creator) => creator?._id || creator?.id || "";

const getCreatorName = (creator) =>
  [creator?.firstName, creator?.middleName, creator?.lastName].filter(Boolean).join(" ") ||
  creator?.universityAccount?.universityEmail ||
  "Unnamed User";

const getCreatorRole = (creator) => {
  const role = creator?.primaryRole || creator?.roles?.[0] || "user";
  return role.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
};

const getCreatorSchool = (creator) =>
  creator?.schoolId?.name || creator?.school?.name || "No school";

const getCreatorMeta = (creator) =>
  creator?.universityAccount?.universityEmail ||
  creator?.personalEmail ||
  creator?.universityAccount?.institutionId ||
  getCreatorId(creator);

const NoticeToolbar = ({
  activeStatus,
  canCreate,
  createdBy = "",
  creatorOptions = [],
  onCreate,
  onCreatorChange,
  onSearch,
  onStatusChange,
  search,
  showStatusTabs = true,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedCreator = useMemo(
    () => creatorOptions.find((creator) => getCreatorId(creator) === createdBy),
    [createdBy, creatorOptions],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {showStatusTabs ? (
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
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
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

          {creatorOptions.length ? (
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold shadow-sm transition ${
                filtersOpen || createdBy
                  ? "border-[var(--stratex-blue)] bg-blue-50 text-[var(--stratex-blue)]"
                  : "border-[var(--border-light)] bg-white text-[var(--university-ink)] hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
              }`}
            >
              <Filter size={16} />
              Filter
            </button>
          ) : null}

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

      {filtersOpen && creatorOptions.length ? (
        <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--border-light)] pb-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-sm font-black text-[var(--university-ink)]">Filter by Creator</h2>
              <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">
                Use school, role, and email to identify the correct user when names match.
              </p>
            </div>
            {createdBy ? (
              <button
                type="button"
                onClick={() => onCreatorChange("")}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-black text-[var(--university-ink)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
              >
                <X size={14} />
                Clear Creator
              </button>
            ) : null}
          </div>

          {selectedCreator ? (
            <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-[var(--stratex-blue)]">
              Showing notices created by {getCreatorName(selectedCreator)}.
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="grid min-w-[720px] gap-3 md:grid-cols-2 xl:grid-cols-3">
            {creatorOptions.map((creator) => {
              const id = getCreatorId(creator);
              const active = id === createdBy;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onCreatorChange(active ? "" : id)}
                  className={`min-w-0 rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-[var(--stratex-blue)] bg-blue-50 shadow-sm"
                      : "border-[var(--border-light)] bg-white hover:border-[var(--stratex-blue)] hover:bg-[var(--surface-soft)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[var(--university-ink)]">{getCreatorName(creator)}</p>
                      <p className="mt-1 truncate text-xs font-bold text-[var(--stratex-blue)]">{getCreatorRole(creator)}</p>
                    </div>
                    <span className={`h-3 w-3 shrink-0 rounded-full ${active ? "bg-[var(--stratex-blue)]" : "bg-[var(--border)]"}`} />
                  </div>
                  <div className="mt-3 space-y-1 border-t border-[var(--border-light)] pt-2">
                    <p className="truncate text-xs font-semibold text-[var(--university-muted)]">School: <span className="font-black text-[var(--university-ink)]">{getCreatorSchool(creator)}</span></p>
                    <p className="truncate text-xs font-semibold text-[var(--university-muted)]">Email/ID: <span className="font-black text-[var(--university-ink)]">{getCreatorMeta(creator)}</span></p>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default NoticeToolbar;
