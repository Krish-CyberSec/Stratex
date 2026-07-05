const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Programs", value: "programs", countKey: "programs" },
  { label: "Faculty", value: "faculty", countKey: "faculty" },
  { label: "Students", value: "students", countKey: "students" },
  { label: "Coordinators", value: "coordinators", countKey: "coordinators" },
  { label: "Documents", value: "documents", disabled: true },
];

const SchoolDetailTabs = ({ activeTab, counts, onChange }) => {
  return (
    <nav className="overflow-x-auto rounded-xl border border-[var(--border-light)] bg-white px-3 shadow-sm">
      <div className="flex min-w-max items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            disabled={tab.disabled}
            onClick={() => {
              if (!tab.disabled) onChange(tab.value);
            }}
            className={`relative inline-flex h-12 items-center gap-2 px-3 text-xs font-bold transition ${
              tab.disabled
                ? "cursor-not-allowed text-[var(--university-muted)] opacity-45"
                : activeTab === tab.value
                  ? "text-[var(--stratex-blue)]"
                  : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
            }`}
          >
            {tab.label}
            {tab.countKey ? (
              <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] text-[var(--university-muted)]">
                {counts[tab.countKey] ?? 0}
              </span>
            ) : null}
            {tab.disabled ? (
              <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] text-[var(--university-muted)]">
                Soon
              </span>
            ) : null}
            {activeTab === tab.value && !tab.disabled ? (
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--stratex-blue)]" />
            ) : null}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SchoolDetailTabs;
