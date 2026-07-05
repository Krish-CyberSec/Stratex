import { Info } from "lucide-react";
import SchoolMetricGrid from "./SchoolMetricGrid";

const SchoolAboutCard = ({ counts, school }) => {
  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--university-ink)]">
        <Info size={17} className="text-[var(--stratex-blue)]" />
        About the School
      </h2>
      <p className="mt-4 text-sm font-medium leading-6 text-[var(--text-secondary)] sm:leading-7">
        {school.description ||
          `${school.name} focuses on building a strong foundation in modern education and professional development.`}
      </p>

      <div className="mt-5">
        <SchoolMetricGrid counts={counts} school={school} />
      </div>
    </section>
  );
};

export default SchoolAboutCard;
