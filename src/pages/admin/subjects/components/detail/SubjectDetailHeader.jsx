import { ArrowLeft } from "lucide-react";
import { getSemesterLabel } from "./subjectDetailUtils";

const SubjectDetailHeader = ({ actions, onBack, subject }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
        <span>My Subjects</span>
        <span>/</span>
        <span>{getSemesterLabel(subject)}</span>
        <span>/</span>
        <span className="text-[var(--university-ink)]">Subject Details</span>
      </div>
      <h1 className="mt-3 text-2xl font-black leading-tight text-[var(--university-ink)] sm:text-3xl">
        Subject Details
      </h1>
      <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
        View detailed information about the selected subject.
      </p>
    </div>

    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:self-start">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
      >
        <ArrowLeft size={15} />
        Back to Subjects
      </button>
      {actions}
    </div>
  </header>
);

export default SubjectDetailHeader;
