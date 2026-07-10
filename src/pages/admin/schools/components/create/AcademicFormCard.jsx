const AcademicFormCard = ({ children, description, icon, title }) => {
  return (
    <section className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6 lg:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[var(--university-ink)]">{title}</h2>
          <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

export default AcademicFormCard;
