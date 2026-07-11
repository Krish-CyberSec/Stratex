import { SubjectStatusBadge, SubjectTypeBadge } from "../SubjectBadges";
import {
  formatDate,
  getAcademicYear,
  getPersonName,
  getProgramName,
  getSchoolName,
  getSemesterLabel,
  getSpecializationName,
} from "./subjectDetailUtils";

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-[112px_1fr] gap-3 text-xs sm:grid-cols-[140px_1fr]">
    <span className="font-bold text-[var(--university-muted)]">{label}</span>
    <span className="min-w-0 break-words font-bold text-[var(--university-ink)]">{value}</span>
  </div>
);

const SubjectOverviewPanels = ({ subject }) => (
  <section className="grid gap-4 lg:grid-cols-2">
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-black text-[var(--university-ink)]">Subject Information</h3>
      <div className="mt-4 space-y-3">
        <DetailRow label="Subject Code" value={subject?.code || "Not available"} />
        <DetailRow label="Subject Name" value={subject?.name || "Not available"} />
        <div className="grid grid-cols-[112px_1fr] gap-3 text-xs sm:grid-cols-[140px_1fr]">
          <span className="font-bold text-[var(--university-muted)]">Type</span>
          <span><SubjectTypeBadge subject={subject} /></span>
        </div>
        <DetailRow label="Credits" value={subject?.credits ?? 0} />
        <DetailRow label="Semester" value={getSemesterLabel(subject)} />
        <DetailRow label="Program" value={getProgramName(subject)} />
        <DetailRow label="Specialization" value={getSpecializationName(subject)} />
        <DetailRow label="Academic Year" value={getAcademicYear()} />
        <DetailRow label="Description" value={subject?.description || "No description available."} />
      </div>
    </div>

    <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-black text-[var(--university-ink)]">Academic Assignment</h3>
      <div className="mt-4 space-y-3">
        <DetailRow label="Program" value={getProgramName(subject)} />
        <DetailRow label="Semester" value={getSemesterLabel(subject)} />
        <DetailRow label="Specialization" value={getSpecializationName(subject)} />
        <DetailRow label="Assignment Type" value={subject?.specializationId ? "Specialization" : "Primary"} />
        <DetailRow label="Faculty / Coordinator" value={getPersonName(subject?.coordinatorId)} />
        <div className="grid grid-cols-[112px_1fr] gap-3 text-xs sm:grid-cols-[140px_1fr]">
          <span className="font-bold text-[var(--university-muted)]">Status</span>
          <span><SubjectStatusBadge status={subject?.status} /></span>
        </div>
        <DetailRow label="School" value={getSchoolName(subject)} />
        <DetailRow label="Assigned On" value={formatDate(subject?.createdAt, "Not available")} />
      </div>
    </div>
  </section>
);

export default SubjectOverviewPanels;
