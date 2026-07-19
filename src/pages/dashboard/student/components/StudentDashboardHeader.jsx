import { Bell, BookOpen, CalendarDays, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getName } from "./studentDashboardUtils";

const quickActions = [
  { label: "Subjects", icon: BookOpen, to: "/dashboard/subjects" },
  { label: "Notices", icon: Bell, to: "/dashboard/notices" },
  { label: "Events", icon: CalendarDays, to: "/dashboard/events" },
];

const StudentDashboardHeader = ({ onRefresh, refreshing, student }) => (
  <header className="rounded-2xl border border-[#e8eef7] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,39,68,0.05)] sm:px-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-black leading-tight text-[#172554] sm:text-2xl">
          Welcome back, {getName(student).split(" ")[0]}
        </h1>
        <p className="mt-2 text-sm font-semibold text-[#64748b]">
          Your academic workspace is synced with your assigned course and semester.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e8eef7] bg-[#f8fbff] px-3 text-xs font-black text-[#172554] transition hover:border-[#4f46e5] hover:bg-white hover:text-[#4f46e5]"
            >
              <Icon size={15} strokeWidth={2.4} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#172554] px-3 text-xs font-black text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:opacity-70"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  </header>
);

export default StudentDashboardHeader;
