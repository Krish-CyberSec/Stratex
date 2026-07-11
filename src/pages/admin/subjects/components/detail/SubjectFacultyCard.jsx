import { Mail } from "lucide-react";
import { getPersonEmail, getPersonName } from "./subjectDetailUtils";

const initialsFor = (person) => {
  const name = getPersonName(person);
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const SubjectFacultyCard = ({ subject }) => {
  const coordinator = subject?.coordinatorId;
  const email = getPersonEmail(coordinator);

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-black text-[var(--university-ink)]">Faculty / Coordinator</h3>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-black text-purple-700">
            {initialsFor(coordinator) || "NA"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[var(--university-ink)]">{getPersonName(coordinator)}</p>
            <p className="text-xs font-bold text-[var(--university-muted)]">Coordinator</p>
          </div>
        </div>

        <div className="grid min-w-0 gap-2 sm:flex sm:items-center sm:gap-6">
          <span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
            <Mail size={14} className="shrink-0 text-[var(--stratex-blue)]" />
            <span className="truncate">{email}</span>
          </span>
          <a
            href={email !== "Not available" ? `mailto:${email}` : undefined}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--border-light)] px-4 text-xs font-bold text-[var(--stratex-blue)] transition hover:border-[var(--stratex-blue)] hover:bg-blue-50"
          >
            Send Email
          </a>
        </div>
      </div>
    </section>
  );
};

export default SubjectFacultyCard;
