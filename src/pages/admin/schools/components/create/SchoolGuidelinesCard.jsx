import { CheckCircle2, Info } from "lucide-react";

const guidelines = [
  "School name must be unique.",
  "Slug must be URL friendly and unique.",
  "Logo size should be square for best results.",
  "Banner size should be wide for best quality.",
  "Provide a clear and concise description.",
];

const SchoolGuidelinesCard = ({
  note = "You can edit all details of the school after it has been created.",
}) => {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[color-mix(in_srgb,var(--stratex-blue)_24%,white)] bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] p-4 sm:p-5">
        <div className="flex gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-[var(--stratex-blue)]" />
          <div>
            <h3 className="text-sm font-bold text-[var(--stratex-blue)]">Note</h3>
            <p className="mt-1 text-sm font-medium leading-6 text-[var(--text-secondary)]">
              {note}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[var(--university-ink)]">Guidelines</h2>
        <ul className="mt-4 space-y-3">
          {guidelines.map((item) => (
            <li key={item} className="flex gap-3 text-sm font-medium text-[var(--text-secondary)]">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[var(--success)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SchoolGuidelinesCard;
