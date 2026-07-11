const audienceOptions = [
  { label: "All", value: "all" },
  { label: "Super Admin", value: "superAdmin" },
  { label: "School Admin", value: "schoolAdmin" },
  { label: "Faculty", value: "faculty" },
  { label: "Coordinator", value: "coordinator" },
  { label: "Student", value: "student" },
  { label: "Exam Cell", value: "examCell" },
];

const NoticeAudienceSelector = ({ audience, onChange }) => {
  const toggle = (value) => {
    if (value === "all") {
      onChange(["all"]);
      return;
    }

    const withoutAll = audience.filter((item) => item !== "all");
    const next = withoutAll.includes(value)
      ? withoutAll.filter((item) => item !== value)
      : [...withoutAll, value];

    onChange(next.length ? next : ["all"]);
  };

  return (
    <div>
      <span className="mb-3 block text-xs font-black text-[var(--university-ink)]">Audience <span className="text-[var(--error)]">*</span></span>
      <div className="flex flex-wrap gap-2">
        {audienceOptions.map((option) => {
          const active = audience.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`h-10 rounded-lg border px-4 text-xs font-black transition ${
                active
                  ? "border-[var(--stratex-blue)] bg-blue-50 text-[var(--stratex-blue)]"
                  : "border-[var(--border-light)] bg-white text-[var(--university-ink)] hover:border-[var(--stratex-blue)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NoticeAudienceSelector;
export { audienceOptions };
