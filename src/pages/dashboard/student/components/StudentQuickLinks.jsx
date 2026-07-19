import { CalendarDays, FileQuestion, HeartHandshake, HelpCircle, Library, MonitorPlay, ReceiptText, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";

const links = [
  { label: "Library", icon: Library, disabled: true, tone: "bg-violet-50 text-violet-700" },
  { label: "E-Learning", icon: MonitorPlay, disabled: true, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Fees", icon: WalletCards, disabled: true, tone: "bg-orange-50 text-orange-700" },
  { label: "My Requests", icon: FileQuestion, to: "/dashboard/notifications", tone: "bg-blue-50 text-[var(--stratex-blue)]" },
  { label: "Feedback", icon: HeartHandshake, disabled: true, tone: "bg-pink-50 text-pink-700" },
  { label: "Help", icon: HelpCircle, to: "/support", tone: "bg-teal-50 text-teal-700" },
  { label: "Calendar", icon: CalendarDays, to: "/dashboard/events", tone: "bg-indigo-50 text-indigo-700" },
  { label: "Syllabus", icon: ReceiptText, to: "/dashboard/subjects", tone: "bg-amber-50 text-amber-700" },
];

const LinkContent = ({ item }) => {
  const Icon = item.icon;

  return (
    <>
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.tone}`}>
        <Icon size={20} strokeWidth={2.35} />
      </span>
      <span className="mt-2 text-center text-xs font-black text-[var(--university-ink)]">{item.label}</span>
      {item.disabled ? <span className="sr-only">Coming soon</span> : null}
    </>
  );
};

const StudentQuickLinks = () => (
  <DashboardPanel className="h-[270px] overflow-hidden" title="Quick Links">
    <div className="grid h-[210px] grid-cols-2 gap-4 overflow-y-auto px-5 pb-5 pt-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      {links.map((item) => item.disabled ? (
        <button
          key={item.label}
          type="button"
          disabled
          className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-transparent bg-white px-2 py-3 opacity-65"
          title="Coming soon"
        >
          <LinkContent item={item} />
        </button>
      ) : (
        <Link
          key={item.label}
          to={item.to}
          className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-transparent bg-white px-2 py-3 transition hover:border-[#4f46e5] hover:bg-[#f8fbff]"
        >
          <LinkContent item={item} />
        </Link>
      ))}
    </div>
  </DashboardPanel>
);

export default StudentQuickLinks;
