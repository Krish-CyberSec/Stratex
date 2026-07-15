import { BookOpen, ChevronDown, GraduationCap, Layers3 } from "lucide-react";

const getProgramLabel = (program) => {
  if (!program) return "Select Program";
  return `${program.name}${program.degreeType ? `, ${program.degreeType}` : ""}`;
};

const SubjectProgramSelector = ({ locked = false, programs, selectedProgramId, onChange }) => {
  const selectedProgram = programs.find((program) => (program._id || program.id) === selectedProgramId);
  const isAllPrograms = !selectedProgramId;

  return (
    <label className="relative block w-full min-w-0 lg:max-w-[430px]">
      <span className="mb-2 block text-xs font-black uppercase text-[var(--stratex-blue)]">Program Scope</span>
      <div className="relative rounded-xl border border-[var(--border-light)] bg-white p-3 shadow-sm transition focus-within:border-[var(--stratex-blue)] hover:border-[color-mix(in_srgb,var(--stratex-blue)_35%,white)]">
        <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
          {isAllPrograms ? <Layers3 size={19} /> : <GraduationCap size={19} />}
        </div>
        <select
          disabled={locked}
          value={selectedProgramId}
          onChange={(event) => onChange(event.target.value)}
          className="h-[54px] w-full appearance-none rounded-lg border-0 bg-transparent pb-1 pl-14 pr-9 pt-0 text-sm font-black text-[var(--university-ink)] outline-none disabled:text-[var(--university-muted)]"
        >
          {!locked ? <option value="">All Programs</option> : null}
          {programs.map((program) => (
            <option key={program._id || program.id} value={program._id || program.id}>
              {getProgramLabel(program)}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-[4.55rem] top-[3.35rem] max-w-[calc(100%-7rem)] truncate text-[11px] font-bold text-[var(--university-muted)]">
          {isAllPrograms
            ? "Same-semester subjects across every program"
            : selectedProgram?.schoolId?.name || "Selected program subjects"}
        </span>
        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={18} />
      </div>
      <span className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] font-bold text-[var(--university-muted)]">
        <BookOpen size={12} />
        <span className="min-w-0 truncate">
          {locked ? "Locked to your active academic assignment" : "Choose one program or browse all programs"}
        </span>
      </span>
    </label>
  );
};

export default SubjectProgramSelector;
