import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import { formatDate, formatTime } from "./studentDashboardUtils";

const StudentEvents = ({ events = [] }) => (
  <DashboardPanel
    className="h-[292px] overflow-hidden"
    title="Upcoming Events"
    action={
      <Link to="/dashboard/events" className="text-xs font-black text-[#4f46e5] hover:text-[#3730a3]">
        View Calendar
      </Link>
    }
  >
    <div className="h-[235px] space-y-2 overflow-y-auto px-4 pb-4 pt-1">
      {events.length ? events.map((event) => (
        <Link
          key={event._id}
          to={`/dashboard/events/${event._id}`}
          className="grid grid-cols-[54px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-1 py-3 transition hover:bg-[#f8fbff]"
        >
          <span className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
            <span className="text-[10px] font-black uppercase">{formatDate(event.startDate, { month: "short" }).split(" ")[1] || "DATE"}</span>
            <span className="text-base font-black leading-4">{formatDate(event.startDate).split(" ")[0]}</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black text-[#172554]">{event.title}</span>
            <span className="mt-1 flex items-center gap-1 truncate text-xs font-bold text-[#64748b]">
              <MapPin size={12} />
              {event.location || "Location TBA"}
            </span>
          </span>
          <span className="hidden text-xs font-black text-[#64748b] sm:block">{formatTime(event.startDate)}</span>
        </Link>
      )) : (
        <div className="px-3 py-10 text-center">
          <CalendarDays className="mx-auto text-[var(--university-muted)]" size={28} />
          <p className="mt-3 text-sm font-bold text-[var(--university-muted)]">No upcoming events found.</p>
        </div>
      )}
    </div>
  </DashboardPanel>
);

export default StudentEvents;
