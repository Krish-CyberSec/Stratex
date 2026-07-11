const tabs = ["Program Details", "Semesters", "Subjects Overview", "Program Analytics"];

const ProgramDetailTabs = ({ activeTab, onChange }) => (
  <div className="overflow-x-auto rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
    <div className="flex min-w-max gap-1 px-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`border-b-2 px-4 py-3 text-xs font-bold transition ${
            activeTab === tab
              ? "border-[var(--stratex-blue)] text-[var(--stratex-blue)]"
              : "border-transparent text-[var(--university-muted)] hover:text-[var(--university-ink)]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default ProgramDetailTabs;
