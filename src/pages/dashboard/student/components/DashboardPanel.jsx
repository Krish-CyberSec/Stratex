const DashboardPanel = ({ action, children, className = "", title }) => (
  <section className={`rounded-xl border border-[#e8eef7] bg-white shadow-[0_8px_24px_rgba(15,39,68,0.04)] transition hover:shadow-[0_14px_34px_rgba(15,39,68,0.08)] ${className}`}>
    {(title || action) ? (
      <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-5">
        <h2 className="min-w-0 text-sm font-black text-[#172554]">{title}</h2>
        <div className="shrink-0">{action}</div>
      </div>
    ) : null}
    {children}
  </section>
);

export default DashboardPanel;
