import { ArrowRight, Bell, CalendarDays, FileText, FolderOpen } from "lucide-react";

const links = [
  { label: "View Syllabus", icon: FileText },
  { label: "Study Resources", icon: FolderOpen },
  { label: "Announcements", icon: Bell },
  { label: "My Timetable", icon: CalendarDays },
];

const SubjectQuickLinks = () => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
    <h3 className="text-sm font-black text-[var(--university-ink)]">Quick Links</h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {links.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          className="flex h-11 items-center justify-between gap-3 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] transition hover:border-[var(--stratex-blue)] hover:bg-blue-50 hover:text-[var(--stratex-blue)]"
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <Icon size={15} className="shrink-0 text-[var(--stratex-blue)]" />
            <span className="truncate">{label}</span>
          </span>
          <ArrowRight size={14} className="shrink-0" />
        </button>
      ))}
    </div>
  </section>
);

export default SubjectQuickLinks;
