import { Grid3X3 } from "lucide-react";

const ProgramSemesterStrip = ({ onSelect, selectedSemester, semesters, subjectCounts }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-[var(--university-ink)]">Semesters</h2>
        <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">Click on any semester to view subjects.</p>
      </div>
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 text-xs font-bold text-[var(--stratex-blue)]"
      >
        <Grid3X3 size={14} />
        View All Semesters
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {semesters.map((semester) => {
        const isActive = selectedSemester === semester.semesterNumber;
        const count = subjectCounts.get(semester.semesterNumber) || 0;

        return (
          <button
            key={semester.id}
            type="button"
            onClick={() => onSelect(semester.semesterNumber)}
            className={`min-h-[72px] rounded-lg border px-3 py-3 text-left transition ${
              isActive
                ? "border-[var(--stratex-blue)] bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] shadow-sm"
                : "border-[var(--border-light)] bg-white hover:border-[color-mix(in_srgb,var(--stratex-blue)_35%,white)]"
            }`}
          >
            <span className="text-xs font-bold text-[var(--university-ink)]">Sem {semester.semesterNumber}</span>
            <span className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[var(--success)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              {count ? `${count} Subjects` : "Active"}
            </span>
          </button>
        );
      })}
    </div>
  </section>
);

export default ProgramSemesterStrip;
