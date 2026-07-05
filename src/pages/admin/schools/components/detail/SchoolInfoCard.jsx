import { Code2, Globe2, Mail, Phone, UserRound } from "lucide-react";

const getPersonName = (person) => {
  if (!person) return "";
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
};

const SchoolInfoCard = ({ school, schoolHead }) => {
  const rows = [
    { label: "School Head", value: getPersonName(schoolHead) || "Dr. John Smith", icon: UserRound },
    { label: "Email", value: school.email || "cse@university.edu", icon: Mail },
    { label: "Phone", value: school.phone || "+1 (123) 456-7890", icon: Phone },
    { label: "Website", value: school.website || "www.cse.university.edu", icon: Globe2 },
    { label: "School Code", value: school.code || school.slug?.slice(0, 8)?.toUpperCase() || "CSE01", icon: Code2 },
  ];

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-bold text-[var(--university-ink)]">School Information</h2>

      <div className="mt-4 divide-y divide-[var(--border-light)]">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[auto_minmax(78px,92px)_minmax(0,1fr)] items-center gap-2 py-3 text-xs sm:grid-cols-[auto_110px_minmax(0,1fr)] sm:gap-3">
            <row.icon size={16} className="text-[var(--university-muted)]" />
            <span className="font-semibold text-[var(--university-muted)]">{row.label}</span>
            <span className="min-w-0 break-words text-right font-bold text-[var(--university-ink)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SchoolInfoCard;
