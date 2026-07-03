import { Pencil, Trash2 } from "lucide-react";
import SchoolLogo from "../SchoolLogo";

const SchoolDetailHeader = ({ school, onDelete, onEdit }) => {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="mb-4 flex min-w-0 items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
          <span>Schools</span>
          <span>/</span>
          <span className="min-w-0 truncate text-[var(--university-ink)]">{school.name}</span>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <SchoolLogo logo={school.logo} name={school.name} size="lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-[var(--text-primary)] sm:text-3xl">
              {school.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
              Excellence in computing education and innovation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:flex-row sm:grid-cols-2 lg:flex">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
        >
          <Pencil size={16} />
          Edit School
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--error)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          <Trash2 size={16} />
          Delete School
        </button>
      </div>
    </header>
  );
};

export default SchoolDetailHeader;
