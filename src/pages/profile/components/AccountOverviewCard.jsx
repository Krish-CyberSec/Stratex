import { Shield } from "lucide-react";
import {
  formatDate,
  getInstitutionId,
  getPrimaryRole,
  getRoleLabel,
  roleScopes,
} from "../profileUtils";
import ProfileSectionCard from "./ProfileSectionCard";

const AccountOverviewCard = ({ user }) => {
  const role = getPrimaryRole(user);
  const rows = [
    { label: "Role", value: getRoleLabel(role) },
    { label: "Employee ID", value: getInstitutionId(user) },
    { label: "Access Level", value: roleScopes[role] || "Standard access" },
    { label: "Joined", value: formatDate(user?.createdAt) },
  ];

  return (
    <ProfileSectionCard icon={Shield} title="Account Overview">
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[var(--border-light)] py-3 last:border-b-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-xs font-bold text-[var(--university-muted)]">{row.label}</span>
            </div>
            <span className="min-w-0 break-words rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_8%,white)] px-2.5 py-1 text-right text-xs font-bold text-[var(--stratex-blue)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
};

export default AccountOverviewCard;
