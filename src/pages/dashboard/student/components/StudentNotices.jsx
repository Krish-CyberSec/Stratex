import { Bell, Megaphone, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import { formatDate, stripHtml } from "./studentDashboardUtils";

const categoryIcon = {
  urgent: ShieldAlert,
  examinations: Bell,
  academic: Bell,
  events: Megaphone,
};

const StudentNotices = ({ notices = [] }) => (
  <DashboardPanel
    className="h-[292px] overflow-hidden"
    title="Important Notices"
    action={
      <Link to="/dashboard/notices" className="text-xs font-black text-[#4f46e5] hover:text-[#3730a3]">
        View All
      </Link>
    }
  >
    <div className="h-[235px] space-y-2 overflow-y-auto px-4 pb-4 pt-1">
      {notices.length ? notices.map((notice) => {
        const Icon = categoryIcon[notice.category] || Megaphone;

        return (
          <Link
            key={notice._id}
            to={`/dashboard/notices/${notice._id}`}
            className="flex gap-3 rounded-lg px-1 py-3 transition hover:bg-[#f8fbff]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
              <Icon size={18} strokeWidth={2.35} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2">
                <p className="line-clamp-2 flex-1 text-sm font-black leading-5 text-[#172554]">{notice.title}</p>
                {notice.category === "urgent" ? <span className="mt-1 h-2 w-2 rounded-full bg-red-500" /> : null}
              </div>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#64748b]">
                {stripHtml(notice.content) || "Open notice for details"}
              </p>
              <p className="mt-1 text-xs font-bold text-[#64748b]">{formatDate(notice.publishedAt || notice.createdAt)}</p>
            </div>
          </Link>
        );
      }) : (
        <div className="px-3 py-10 text-center">
          <Bell className="mx-auto text-[var(--university-muted)]" size={28} />
          <p className="mt-3 text-sm font-bold text-[var(--university-muted)]">No notices for you right now.</p>
        </div>
      )}
    </div>
  </DashboardPanel>
);

export default StudentNotices;
