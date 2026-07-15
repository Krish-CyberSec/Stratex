import { ArrowRight, Bell, CircleHelp, Archive, Settings } from "lucide-react";

const categorySeed = [
  { label: "Academic", key: "academic", count: 10 },
  { label: "Examinations", key: "examinations", count: 6 },
  { label: "Events", key: "events", count: 4 },
  { label: "General", key: "general", count: 3 },
  { label: "Holidays", key: "holidays", count: 1 },
];

const NoticeSidebar = ({ counts }) => (
  <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-base font-black text-[var(--university-ink)]">Notice Categories</h2>
      <div className="mt-2 h-0.5 w-7 rounded-full bg-[var(--stratex-blue)]" />
      <div className="mt-5 space-y-4">
        {categorySeed.map((category, index) => (
          <div key={category.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-[var(--university-ink)]">{category.label}</span>
            <span className="font-black text-[var(--stratex-blue)]">{counts?.[category.key] ?? category.count ?? index + 1}</span>
          </div>
        ))}
      </div>
      <button type="button" className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[var(--stratex-blue)]">
        View all categories
        <ArrowRight size={14} />
      </button>
    </section>

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-base font-black text-[var(--university-ink)]">Quick Links</h2>
      <div className="mt-2 h-0.5 w-7 rounded-full bg-[var(--stratex-blue)]" />
      <div className="mt-5 space-y-3">
        {[
          { label: "View Archived Notices", icon: Archive },
          { label: "My Notifications", icon: Bell },
          { label: "Notification Settings", icon: Settings },
        ].map(({ icon: Icon, label }) => (
          <button key={label} type="button" className="flex w-full items-center justify-between gap-3 rounded-lg py-1.5 text-left text-sm font-bold text-[var(--university-ink)] transition hover:text-[var(--stratex-blue)]">
            <span className="inline-flex min-w-0 items-center gap-2">
              <Icon size={15} className="shrink-0 text-[var(--stratex-blue)]" />
              <span className="truncate">{label}</span>
            </span>
            <ArrowRight size={14} className="shrink-0 text-[var(--stratex-blue)]" />
          </button>
        ))}
      </div>
    </section>

    <section className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[var(--stratex-blue)]">
        <CircleHelp size={18} />
        <h2 className="text-base font-black">Need Help?</h2>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[var(--university-muted)]">
        If you have any questions regarding notices, contact the help center.
      </p>
      <button type="button" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white text-xs font-black text-[var(--stratex-blue)]">
        Go to Help Center
        <ArrowRight size={14} />
      </button>
    </section>
  </aside>
);

export default NoticeSidebar;
