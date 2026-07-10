import { Camera, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import logo from "../../../assets/logo.png";
import {
  formatDate,
  getFullName,
  getInitials,
  getPrimaryRole,
  getRoleLabel,
  getSchoolName,
  getUniversityEmail,
  schoolBannerRoles,
} from "../profileUtils";

const ProfileHero = ({ bannerUrl, profileImage, user }) => {
  const name = getFullName(user);
  const role = getPrimaryRole(user);
  const shouldUseSchoolBanner = schoolBannerRoles.has(role);
  const email = getUniversityEmail(user) || user?.personalEmail || "No email available";
  const schoolName = shouldUseSchoolBanner ? getSchoolName(user) : "K.R. Mangalam University";

  return (
    <section className="relative overflow-hidden rounded-xl border border-[var(--border-light)] bg-[var(--stratex-navy)] shadow-sm">
      {shouldUseSchoolBanner && bannerUrl ? (
        <img src={bannerUrl} alt={`${schoolName} banner`} className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,39,68,0.96),rgba(15,39,68,0.82)_52%,rgba(15,39,68,0.42))]" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(135deg,transparent_38%,rgba(200,169,107,0.72)_39%,transparent_48%)] md:block" />

      <div className="relative flex min-h-52 flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--stratex-blue)] text-4xl font-bold text-white shadow-lg ring-4 ring-white/15 sm:h-28 sm:w-28">
            {profileImage ? (
              <img src={profileImage} alt={`${name} profile`} className="h-full w-full object-cover" />
            ) : (
              getInitials(name)
            )}
            <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-[var(--stratex-blue)] shadow-sm">
              <Camera size={15} />
            </span>
          </div>

          <div className="min-w-0 text-white">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="min-w-0 break-words text-2xl font-bold sm:text-3xl">{name}</h1>
              <ShieldCheck size={19} className="shrink-0 text-[var(--stratex-gold)]" />
            </div>
            <p className="mt-1 text-sm font-semibold text-blue-100">{getRoleLabel(role)}</p>
            <div className="mt-3 space-y-1.5 text-sm font-medium text-white/88">
              <p className="flex min-w-0 items-center gap-2">
                <Mail size={15} className="shrink-0" />
                <span className="min-w-0 break-all">{email}</span>
              </p>
              <p className="flex min-w-0 items-center gap-2">
                <CalendarDays size={15} className="shrink-0" />
                <span>Joined on {formatDate(user?.createdAt)}</span>
              </p>
              <p className="truncate">{schoolName}</p>
            </div>
          </div>
        </div>

        {!shouldUseSchoolBanner ? (
          <div className="hidden h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/95 p-3 shadow-lg lg:flex">
            <img src={logo} alt="College logo" className="h-full w-full object-contain" />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProfileHero;
