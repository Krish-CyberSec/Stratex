import { Check } from "lucide-react";

const createSteps = [
  { id: 1, title: "Select Academic Context", subtitle: "Program, Semester & Specialization" },
  { id: 2, title: "Select Subject", subtitle: "Choose subject to add" },
  { id: 3, title: "Subject Details", subtitle: "Review subject information" },
  { id: 4, title: "Confirm", subtitle: "Verify and add subject" },
];

const editSteps = [
  { id: 1, title: "Academic Context", subtitle: "Review assigned context" },
  { id: 2, title: "Edit Subject", subtitle: "Update subject information" },
  { id: 3, title: "Subject Details", subtitle: "Review updated information" },
  { id: 4, title: "Confirm", subtitle: "Verify and save subject" },
];

const SubjectCreateStepper = ({ mode = "create", step }) => {
  const steps = mode === "edit" ? editSteps : createSteps;

  return (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((item) => {
        const complete = step > item.id;
        const active = step === item.id;

        return (
          <div key={item.id} className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                complete
                  ? "bg-[var(--success)] text-white"
                  : active
                    ? "bg-[var(--stratex-blue)] text-white shadow-sm"
                    : "bg-[var(--surface-soft)] text-[var(--university-muted)]"
              }`}
            >
              {complete ? <Check size={16} /> : item.id}
            </span>
            <div className="min-w-0">
              <p className={`truncate text-xs font-black ${active ? "text-[var(--stratex-blue)]" : "text-[var(--university-ink)]"}`}>
                {item.title}
              </p>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--university-muted)]">{item.subtitle}</p>
            </div>
            {item.id < steps.length ? <span className="hidden h-px flex-1 bg-[var(--border-light)] md:block" /> : null}
          </div>
        );
      })}
    </div>
  </section>
  );
};

export default SubjectCreateStepper;
