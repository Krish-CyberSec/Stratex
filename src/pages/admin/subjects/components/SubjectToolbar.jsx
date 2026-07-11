import { Download, Search } from "lucide-react";

const SubjectToolbar = ({ onSearch, search }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <label className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={15} />
      <input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search subjects..."
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
      />
    </label>
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
    >
      <Download size={15} />
      Download
    </button>
  </div>
);

export default SubjectToolbar;
