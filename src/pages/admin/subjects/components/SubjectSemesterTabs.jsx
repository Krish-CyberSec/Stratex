const SubjectSemesterTabs = ({ activeSemester, counts, onChange, semesters }) => (
  <div className="overflow-x-auto border-b border-[var(--border-light)] pb-4">
    <div className="flex min-w-max gap-3">
      {semesters.map((semester) => {
        const count = counts.get(semester.semesterNumber) || 0;
        const isActive = activeSemester === semester.semesterNumber;

        return (
          <button
            key={semester.semesterNumber}
            type="button"
            onClick={() => onChange(semester.semesterNumber)}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-bold transition ${
              isActive
                ? "border-[var(--stratex-blue)] bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] text-[var(--stratex-blue)] shadow-sm"
                : "border-[var(--border-light)] bg-white text-[var(--university-ink)] hover:border-[color-mix(in_srgb,var(--stratex-blue)_35%,white)]"
            }`}
          >
            Sem {semester.semesterNumber}
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${isActive ? "bg-white" : "bg-green-50 text-[var(--success)]"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default SubjectSemesterTabs;
