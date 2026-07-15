const toneClasses = {
  blue: "bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]",
  green: "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-violet-50 text-violet-600",
};

const ProgramStatCard = ({ icon: Icon, label, sublabel, tone = "blue", value }) => {
  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none text-[var(--university-ink)]">{value}</p>
          <p className="mt-1 text-sm font-bold text-[var(--university-ink)]">{label}</p>
          <p className="mt-1 truncate text-xs font-semibold text-[var(--university-muted)]">{sublabel}</p>
        </div>
      </div>
    </section>
  );
};

export default ProgramStatCard;

