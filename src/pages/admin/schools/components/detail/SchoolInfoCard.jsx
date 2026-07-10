import { BadgeCheck, Code2, Globe2, Mail, UserRound } from "lucide-react";

const getPersonName = (person) => {
  if (!person) return "";
  return person.fullName || [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ");
};

const getGeneratedWebsite = (slug) => {
  const baseUrl = (import.meta.env.VITE_UNIVERSITY_BASE_URL || "").replace(/\/+$/, "");
  if (!baseUrl) return "";
  return `${baseUrl}/${slug || "school"}/`;
};

const SchoolInfoCard = ({ school, schoolAdmin }) => {
  const adminEmail =
    schoolAdmin?.universityAccount?.universityEmail ||
    schoolAdmin?.personalEmail ||
    "";
  const adminInstitutionId = schoolAdmin?.universityAccount?.institutionId || "";

  const rows = [
    { label: "School Admin", value: getPersonName(schoolAdmin) || "Not assigned", icon: UserRound },
    { label: "Admin Email", value: adminEmail || "Not assigned", icon: Mail },
    { label: "Admin ID", value: adminInstitutionId || "Not assigned", icon: BadgeCheck },
    { label: "School Email", value: school.email || "cse@university.edu", icon: Mail },
    { label: "Website", value: school.website || getGeneratedWebsite(school.slug) || "Not configured", icon: Globe2 },
    { label: "School Code", value: school.code || school.slug?.slice(0, 8)?.toUpperCase() || "CSE01", icon: Code2 },
  ];

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-bold text-[var(--university-ink)]">School Information</h2>

      <div className="mt-4 divide-y divide-[var(--border-light)]">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[auto_minmax(86px,102px)_minmax(0,1fr)] items-center gap-2 py-3 text-xs sm:grid-cols-[auto_118px_minmax(0,1fr)] sm:gap-3">
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
