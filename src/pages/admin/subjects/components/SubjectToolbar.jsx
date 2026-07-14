import { Download, Plus, Search } from "lucide-react";

const SubjectToolbar = ({ canAdd, canBulk, onAdd, onBulk, onSearch, search }) => {
  const actionCount = 1 + (canBulk ? 1 : 0) + (canAdd ? 1 : 0);
  const actionGridClass =
    actionCount === 3
      ? "min-[480px]:grid-cols-3"
      : actionCount === 2
        ? "min-[420px]:grid-cols-2"
        : "grid-cols-1";

  return (
  <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
    <label className="relative w-full min-w-0 sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={15} />
      <input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search subjects..."
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
      />
    </label>
    <div className={`grid w-full grid-cols-1 gap-2 ${actionGridClass} sm:flex sm:w-auto sm:items-center`}>
      {canBulk ? (
        <button
          type="button"
          onClick={onBulk}
          className="inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border-light)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
        >
          Bulk Upload
        </button>
      ) : null}
      <button
        type="button"
        className="inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
      >
        <Download size={15} />
        Download
      </button>
      {canAdd ? (
        <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
      >
        <Plus size={15} />
        Add Subject
        </button>
      ) : null}
    </div>
  </div>
  );
};

export default SubjectToolbar;
