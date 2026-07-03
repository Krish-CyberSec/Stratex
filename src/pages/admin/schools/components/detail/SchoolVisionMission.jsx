import { BadgeCheck, Eye } from "lucide-react";

const SchoolVisionMission = ({ school }) => {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--stratex-blue)]">
          <Eye size={16} />
          Vision
        </h3>
        <p className="mt-3 text-xs font-medium leading-6 text-[var(--text-secondary)]">
          {school.vision ||
            "To be a global leader in education, driving innovation and societal impact."}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--success)]">
          <BadgeCheck size={16} />
          Mission
        </h3>
        <p className="mt-3 text-xs font-medium leading-6 text-[var(--text-secondary)]">
          {school.mission ||
            "To provide transformative education, foster academic excellence, and develop responsible professionals."}
        </p>
      </div>
    </section>
  );
};

export default SchoolVisionMission;
