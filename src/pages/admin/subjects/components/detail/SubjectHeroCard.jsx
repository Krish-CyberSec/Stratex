import { Code2 } from "lucide-react";
import { SubjectStatusBadge, SubjectTypeBadge } from "../SubjectBadges";

const tabs = ["Overview", "Syllabus", "Faculty", "Resources", "Announcements"];

const SubjectHeroCard = ({ activeTab, onTabChange, subject }) => (
  <section className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_9%,white)] text-[var(--stratex-blue)]">
          <Code2 size={30} />
        </span>
        <div className="min-w-0">
          <SubjectTypeBadge subject={subject} />
          <h2 className="mt-2 break-words text-xl font-black leading-tight text-[var(--university-ink)] sm:text-2xl">
            {subject?.name || "Subject Name"}
          </h2>
          <p className="mt-1 text-sm font-bold text-[var(--stratex-blue)]">{subject?.code || "Subject Code"}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
        <SubjectStatusBadge status={subject?.status} />
        <p className="text-sm font-black text-[var(--university-ink)]">{subject?.credits ?? 0} Credits</p>
      </div>
    </div>

    <div className="overflow-x-auto border-t border-[var(--border-light)] px-3">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`border-b-2 px-3 py-3 text-xs font-bold transition ${
              activeTab === tab
                ? "border-[var(--stratex-blue)] text-[var(--stratex-blue)]"
                : "border-transparent text-[var(--university-muted)] hover:text-[var(--university-ink)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default SubjectHeroCard;
