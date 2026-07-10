import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSchoolById } from "../../services/schoolService";
import { getUserById, updateUser } from "../../services/userService";
import AccountOverviewCard from "./components/AccountOverviewCard";
import AvatarCropperModal from "./components/AvatarCropperModal";
import MfaStatusCard from "./components/MfaStatusCard";
import ProfileDetailsForm from "./components/ProfileDetailsForm";
import ProfileHero from "./components/ProfileHero";
import ProfilePictureCard from "./components/ProfilePictureCard";
import {
  getFullName,
  getPersonalEmail,
  getPrimaryRole,
  getProfileImage,
  getUniversityEmail,
  schoolBannerRoles,
} from "./profileUtils";

const getSchoolId = (user) => {
  if (!user?.schoolId) return "";
  if (typeof user.schoolId === "string") return user.schoolId;
  return user.schoolId._id || user.schoolId.id || "";
};

const getInitialForm = (user) => ({
  fullName: getFullName(user),
  personalEmail: getPersonalEmail(user) || getUniversityEmail(user),
  bio: "",
});

const splitFullName = (value) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  };
};

const useObjectUrl = (file) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url;
};

const Profile = () => {
  const { user, getCurrentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [form, setForm] = useState(() => getInitialForm(user));
  const [school, setSchool] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileFile, setProfileFile] = useState(null);
  const [cropSourceFile, setCropSourceFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const profilePreview = useObjectUrl(profileFile);

  const sourceUser = profileUser || user;
  const role = getPrimaryRole(sourceUser);
  const schoolId = getSchoolId(sourceUser);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user?._id) {
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);

      try {
        const response = await getUserById(user._id);
        const nextUser = response.data?.user || response.data?.data || response.data;
        if (isMounted) {
          setProfileUser(nextUser);
          setForm(getInitialForm(nextUser));
        }
      } catch {
        if (isMounted) {
          setProfileUser(user);
          setForm(getInitialForm(user));
        }
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const loadSchool = async () => {
      if (!schoolBannerRoles.has(role) || !schoolId) {
        setSchool(null);
        return;
      }

      try {
        const response = await getSchoolById(schoolId);
        const nextSchool = response.data?.data || response.data?.school || response.data;
        if (isMounted) setSchool(nextSchool);
      } catch {
        if (isMounted) setSchool(null);
      }
    };

    loadSchool();

    return () => {
      isMounted = false;
    };
  }, [role, schoolId]);

  const enrichedUser = useMemo(
    () => ({
      ...sourceUser,
      schoolId:
        school ||
        (typeof sourceUser?.schoolId === "object" ? sourceUser.schoolId : sourceUser?.schoolId),
    }),
    [school, sourceUser],
  );

  const bannerUrl = school?.banner || sourceUser?.schoolId?.banner || "";
  const profileImage = profilePreview || getProfileImage(sourceUser);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleProfilePhotoSelect = (file) => {
    if (!file) return;
    setCropSourceFile(file);
  };

  const handleCropApply = (file) => {
    setProfileFile(file);
    setCropSourceFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const canPersist = Boolean(sourceUser?._id);

    try {
      if (canPersist) {
        const payload = new FormData();
        const nameParts = splitFullName(form.fullName);
        payload.append("firstName", nameParts.firstName);
        payload.append("lastName", nameParts.lastName);
        payload.append("personalEmail", form.personalEmail.trim());
        if (profileFile) payload.append("profile", profileFile);

        await updateUser(sourceUser._id, payload);
        await getCurrentUser();
        const response = await getUserById(sourceUser._id);
        const nextUser = response.data?.user || response.data?.data || response.data;
        setProfileUser(nextUser);
        setProfileFile(null);
        setStatus("Profile information updated successfully.");
      } else {
        setStatus("Unable to identify the current user for profile update.");
      }
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to save profile changes right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-4">
        <header className="space-y-2">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--university-muted)]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Profile</span>
            <span>/</span>
            <span className="text-[var(--university-ink)]">Edit Profile</span>
          </nav>
          <div>
            <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
              Edit Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
              Update your personal information and keep your profile up to date.
            </p>
          </div>
        </header>

        {loadingProfile ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
            <div className="space-y-4">
              <div className="h-56 animate-pulse rounded-2xl bg-white" />
              <div className="h-[520px] animate-pulse rounded-2xl bg-white" />
            </div>
            <div className="space-y-4">
              <div className="h-72 animate-pulse rounded-2xl bg-white" />
              <div className="h-64 animate-pulse rounded-2xl bg-white" />
            </div>
          </div>
        ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-4">
            <ProfileHero bannerUrl={bannerUrl} profileImage={profileImage} user={enrichedUser} />
            <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 shadow-sm">
              <div className="flex min-w-0 overflow-x-auto">
                <button
                  type="button"
                  className="inline-flex h-12 shrink-0 items-center gap-2 border-b-2 border-[var(--stratex-blue)] px-4 text-sm font-bold text-[var(--stratex-blue)]"
                >
                  Personal Information
                </button>
              </div>
            </div>
            <ProfileDetailsForm
              form={form}
              onChange={updateField}
              onSubmit={handleSubmit}
              saving={saving}
              status={status}
              user={enrichedUser}
            />
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <ProfilePictureCard
              image={profileImage}
              onImageChange={handleProfilePhotoSelect}
              user={enrichedUser}
            />
            <AccountOverviewCard user={enrichedUser} />
            <MfaStatusCard />
          </aside>
        </div>
        )}
      </div>

      <AvatarCropperModal
        file={cropSourceFile}
        onApply={handleCropApply}
        onClose={() => setCropSourceFile(null)}
      />
    </div>
  );
};

export default Profile;
