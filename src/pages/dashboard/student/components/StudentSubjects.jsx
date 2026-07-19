import { ArrowRight, BookMarked, Code2, Database, Network, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import { getPersonName } from "./studentDashboardUtils";

const subjectIcons = [Network, ShieldCheck, Database, Code2, BookMarked];

const StudentSubjects = ({ subjects = [] }) => (
  <DashboardPanel
    className="h-[292px] overflow-hidden"
    title="My Subjects"
    action={
      <Link to="/dashboard/subjects" className="text-xs font-black text-[#4f46e5] hover:text-[#3730a3]">
        View All
      </Link>
    }
  >
    <div className="h-[235px] overflow-y-auto px-4 pb-4 pt-1">
      {subjects.length ? subjects.map((subject, index) => {
        const Icon = subjectIcons[index % subjectIcons.length];

        return (
          <Link
            key={subject._id || subject.code}
            to={subject._id ? `/dashboard/subjects/${subject._id}` : "/dashboard/subjects"}
            className="flex items-center gap-3 rounded-lg px-1 py-3 transition hover:bg-[#f8fbff]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
              <Icon size={18} strokeWidth={2.35} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#172554]">{subject.name}</p>
              <p className="mt-0.5 text-xs font-bold text-[#64748b]">{subject.code || "Subject code pending"}</p>
            </div>
            <p className="hidden max-w-[120px] truncate text-xs font-bold text-[#64748b] sm:block">
              {getPersonName(subject.faculty)}
            </p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e8eef7] text-[#4f46e5]">
              <ArrowRight size={15} />
            </span>
          </Link>
        );
      }) : (
        <div className="px-3 py-10 text-center">
          <BookMarked className="mx-auto text-[var(--university-muted)]" size={28} />
          <p className="mt-3 text-sm font-bold text-[var(--university-muted)]">No subjects assigned yet.</p>
        </div>
      )}
    </div>
  </DashboardPanel>
);

export default StudentSubjects;
