import { BookOpen, ChevronDown, GraduationCap, Layers3 } from "lucide-react";

const getProgramLabel = (program) => {
  if (!program) return "Select Program";
  return `${program.name}${program.degreeType ? `, ${program.degreeType}` : ""}`;
};

const SubjectProgramSelector = ({ locked = false, programs, selectedProgramId, onChange }) => {
  const selectedProgram = programs.find((program) => (program._id || program.id) === selectedProgramId);
  const isAllPrograms = !selectedProgramId;

  return (
    <label className="relative block w-full sm:max-w-md">
      <span className="sr-only">Select program</span>
      <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
        {isAllPrograms ? <Layers3 size={18} /> : <GraduationCap size={18} />}
      </div>
      <select
        disabled={locked}
        value={selectedProgramId}
        onChange={(event) => onChange(event.target.value)}
        className="h-[72px] w-full appearance-none rounded-xl border border-[var(--border-light)] bg-white pb-2 pl-16 pr-10 pt-6 text-sm font-bold text-[var(--university-ink)] shadow-sm outline-none transition hover:border-[color-mix(in_srgb,var(--stratex-blue)_35%,white)] focus:border-[var(--stratex-blue)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]"
      >
        {!locked ? <option value="">All Programs</option> : null}
        {programs.map((program) => (
          <option key={program._id || program.id} value={program._id || program.id}>
            {getProgramLabel(program)}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute left-16 top-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--stratex-blue)]">
        <BookOpen size={12} />
        Program Scope
      </span>
      <span className="pointer-events-none absolute left-16 top-[2.95rem] max-w-[calc(100%-6rem)] truncate text-[11px] font-semibold text-[var(--university-muted)]">
        {isAllPrograms
          ? "Fetch same-semester subjects across every program"
          : selectedProgram?.schoolId?.name || "Selected program subjects"}
      </span>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={18} />
    </label>
  );
};

export default SubjectProgramSelector;
