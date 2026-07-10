import { BadgeCheck, Clock, IdCard, Shield } from "lucide-react";
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
    { label: "Role", value: getRoleLabel(role), icon: Shield, tone: "blue" },
    { label: "Institution ID", value: getInstitutionId(user), icon: IdCard, tone: "blue" },
    { label: "Access Level", value: roleScopes[role] || "Standard access", icon: BadgeCheck, tone: "green" },
    { label: "Joined", value: formatDate(user?.createdAt), icon: Clock, tone: "slate" },
  ];

  return (
    <ProfileSectionCard icon={Shield} title="Account Overview">
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-soft)] px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[var(--stratex-blue)]">
                <row.icon size={15} />
              </span>
              <span className="text-xs font-bold text-[var(--university-muted)]">{row.label}</span>
            </div>
            <span className="min-w-0 break-words text-right text-xs font-bold text-[var(--university-ink)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
};

export default AccountOverviewCard;
