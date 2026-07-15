import { ArrowRight, CalendarDays, CircleHelp, GraduationCap, ShieldCheck } from "lucide-react";
import { SubjectStatusBadge } from "../SubjectBadges";
import {
  getProgramName,
  getSemesterLabel,
  getSpecializationName,
  getTypeLabel,
} from "./subjectDetailUtils";

const SummaryRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 text-xs">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--stratex-blue)]">
      <Icon size={13} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="font-bold text-[var(--university-muted)]">{label}</p>
      <div className="mt-1 break-words font-black text-[var(--university-ink)]">{value}</div>
    </div>
  </div>
);

const DateRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 text-xs">
    <span className="inline-flex items-center gap-2 font-bold text-[var(--university-muted)]">
      <CalendarDays size={14} className="text-[var(--stratex-blue)]" />
      {label}
    </span>
    <span className="text-right font-black text-[var(--university-ink)]">{value}</span>
  </div>
);

const SubjectDetailSidebar = ({ subject }) => (
  <aside className="space-y-4">
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-black text-[var(--university-ink)]">Subject Summary</h3>
      <div className="mt-4 space-y-4">
        <SummaryRow icon={ShieldCheck} label="Type" value={getTypeLabel(subject)} />
        <SummaryRow icon={ShieldCheck} label="Credits" value={subject?.credits ?? 0} />
        <SummaryRow icon={ShieldCheck} label="Semester" value={getSemesterLabel(subject)} />
        <SummaryRow icon={GraduationCap} label="Program" value={getProgramName(subject)} />
        <SummaryRow icon={ShieldCheck} label="Specialization" value={getSpecializationName(subject)} />
        <SummaryRow icon={ShieldCheck} label="Status" value={<SubjectStatusBadge status={subject?.status} />} />
      </div>
    </section>

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-black text-[var(--university-ink)]">Important Dates</h3>
      <div className="mt-4 space-y-4">
        <DateRow label="Classes Start" value="Not scheduled" />
        <DateRow label="Mid Term Exam" value="Not scheduled" />
        <DateRow label="End Term Exam" value="Not scheduled" />
      </div>
    </section>

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="inline-flex items-center gap-2 text-sm font-black text-[var(--stratex-blue)]">
        <CircleHelp size={16} />
        Need Help?
      </h3>
      <p className="mt-3 text-xs font-semibold leading-5 text-[var(--university-muted)]">
        If you have any questions regarding this subject, contact your coordinator.
      </p>
      <button
        type="button"
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] text-xs font-bold text-[var(--stratex-blue)] transition hover:border-[var(--stratex-blue)] hover:bg-blue-50"
      >
        Help Center
        <ArrowRight size={14} />
      </button>
    </section>
  </aside>
);

export default SubjectDetailSidebar;
