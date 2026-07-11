import { LockKeyhole } from "lucide-react";
import ProfileSectionCard from "./ProfileSectionCard";

const MfaStatusCard = () => {
  return (
    <ProfileSectionCard
      icon={LockKeyhole}
      title="Multi-Factor Authentication"
      description="MFA is disabled for now and will be implemented in a future update."
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-amber-800">Status</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            Disabled
          </span>
        </div>
      </div>
    </ProfileSectionCard>
  );
};

export default MfaStatusCard;
