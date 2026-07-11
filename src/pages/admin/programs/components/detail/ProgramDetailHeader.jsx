import { ArrowLeft, Check, Edit3, Eye, X } from "lucide-react";
import DegreeBadge from "../DegreeBadge";
import ProgramStatusBadge from "../ProgramStatusBadge";
import { getSchoolName } from "./programDetailUtils";

const ProgramDetailHeader = ({
  isEditing = false,
  canSave = true,
  onBack,
  onCancel,
  onEdit,
  onSave,
  program,
  saving = false,
}) => (
  <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
        <button type="button" onClick={onBack} className="transition hover:text-[var(--stratex-blue)]">
          Dashboard
        </button>
        <span>/</span>
        <button type="button" onClick={onBack} className="transition hover:text-[var(--stratex-blue)]">
          Programs
        </button>
        <span>/</span>
        <span className="max-w-[260px] truncate text-[var(--university-ink)]">{program.name}</span>
      </div>

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
          title="Back to programs"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              {program.name}
            </h1>
            <ProgramStatusBadge status={program.status} />
            <DegreeBadge type={program.degreeType} />
          </div>
          <p className="mt-1 line-clamp-2 max-w-4xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
            {program.description || `View program details, semesters, and subjects for ${getSchoolName(program)}.`}
          </p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap lg:justify-end">
      <button
        type="button"
        disabled={isEditing || saving}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
      >
        <Eye size={16} />
        View Mode
      </button>
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={!canSave || saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
        >
          <Edit3 size={16} />
          Edit Mode
        </button>
      )}
    </div>
  </header>
);

export default ProgramDetailHeader;
