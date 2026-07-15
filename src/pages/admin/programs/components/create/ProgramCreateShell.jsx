import { Eye, Info } from "lucide-react";

export const ProgramCreateCard = ({ children, step, subtitle, title }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6">
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-sm font-bold text-[var(--stratex-blue)]">
        {step}
      </span>
      <div>
        <h2 className="text-sm font-bold text-[var(--university-ink)]">{title}</h2>
        <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

export const ProgramSideCard = ({ children, title, subtitle, icon = "eye" }) => {
  const Icon = icon === "info" ? Info : Eye;

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
          <Icon size={17} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-[var(--university-ink)]">{title}</h2>
          <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
};

