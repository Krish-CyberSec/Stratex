import { BookOpen, CircleHelp } from "lucide-react";

const guidelines = [
  "Select the correct program and semester before adding a subject.",
  "Subject code must be unique within the selected program and semester.",
  "Common curriculum subjects are created without specialization.",
  "Use inactive status only when the subject should not appear to users.",
];

const editGuidelines = [
  "Review the locked academic context before editing the subject.",
  "Subject code, program, semester and specialization stay locked after creation.",
  "Keep the subject name and description clear for students and faculty.",
  "Use inactive status only when the subject should not appear to users.",
];

const SubjectCreateSide = ({ mode = "create", summary }) => {
  const activeGuidelines = mode === "edit" ? editGuidelines : guidelines;

  return (
  <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
    {summary ? (
      <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--university-ink)]">Subject Preview</h2>
        <div className="mt-4 space-y-3 text-xs font-semibold">
          {summary.map((item) => (
            <div key={item.label} className="flex justify-between gap-3">
              <span className="text-[var(--university-muted)]">{item.label}</span>
              <span className="max-w-[60%] truncate text-right font-bold text-[var(--university-ink)]">{item.value || "--"}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null}

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-[var(--stratex-blue)]">
        <BookOpen size={17} />
        <h2 className="text-sm font-bold">Guidelines</h2>
      </div>
      <ul className="space-y-3">
        {activeGuidelines.map((item) => (
          <li key={item} className="text-xs font-medium leading-5 text-[var(--text-secondary)]">
            + {item}
          </li>
        ))}
      </ul>
    </section>

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[var(--stratex-blue)]">
        <CircleHelp size={17} />
        <h2 className="text-sm font-bold">Need Help?</h2>
      </div>
      <p className="text-xs font-medium leading-5 text-[var(--university-muted)]">
        Contact your program coordinator or visit the help center.
      </p>
      <button className="mt-4 h-10 w-full rounded-lg border border-[var(--border)] bg-white text-xs font-bold text-[var(--stratex-blue)]">
        Help Center
      </button>
    </section>
  </aside>
  );
};

export default SubjectCreateSide;
