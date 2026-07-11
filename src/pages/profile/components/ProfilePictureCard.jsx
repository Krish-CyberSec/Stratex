import { Camera, Upload } from "lucide-react";
import { getFullName, getInitials } from "../profileUtils";
import ProfileSectionCard from "./ProfileSectionCard";

const ProfilePictureCard = ({ image, onImageChange, user }) => {
  const name = getFullName(user);

  return (
    <ProfileSectionCard
      icon={Camera}
      title="Profile Picture"
      description="Upload and crop a profile picture. JPG or PNG up to 5MB."
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--stratex-blue)] text-4xl font-bold text-white shadow-sm">
          {image ? (
            <img src={image} alt={`${name} profile`} className="h-full w-full object-cover" />
          ) : (
            getInitials(name)
          )}
          <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-[var(--stratex-blue)] shadow-sm">
            <Camera size={15} />
          </span>
        </div>

        <label className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--stratex-blue)] bg-white px-4 text-sm font-bold text-[var(--stratex-blue)] transition hover:bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)]">
          <Upload size={16} />
          Change Photo
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => onImageChange(event.target.files?.[0] || null)}
          />
        </label>
        <p className="mt-3 text-xs font-medium leading-5 text-[var(--university-muted)]">
          Crop the image, then save changes to upload it.
        </p>
      </div>
    </ProfileSectionCard>
  );
};

export default ProfilePictureCard;
