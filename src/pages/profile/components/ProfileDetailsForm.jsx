import { Save, UserRound } from "lucide-react";
import {
  getAssignmentSummary,
  getInstitutionId,
  getPrimaryRole,
  getRoleLabel,
  getSchoolName,
  getUniversityEmail,
  roleScopes,
} from "../profileUtils";
import ProfileField from "./ProfileField";
import ProfileSectionCard from "./ProfileSectionCard";

const getRoleSpecificFields = (user) => {
  const role = getPrimaryRole(user);
  const assignment = getAssignmentSummary(user);

  if (role === "superAdmin") {
    return { designation: roleScopes[role], department: "Administration" };
  }

  if (role === "examCell") {
    return { designation: roleScopes[role], department: "Examination Cell" };
  }

  if (role === "student") {
    return {
      designation: assignment.semester !== "Not assigned" ? `Semester ${assignment.semester}` : "Student",
      department: `${getSchoolName(user)}${assignment.program !== "Not assigned" ? ` / ${assignment.program}` : ""}`,
    };
  }

  return {
    designation: getRoleLabel(role),
    department: `${getSchoolName(user)}${assignment.program !== "Not assigned" ? ` / ${assignment.program}` : ""}`,
  };
};

const ProfileDetailsForm = ({ form, onChange, onSubmit, saving, status, user }) => {
  const roleFields = getRoleSpecificFields(user);

  return (
    <ProfileSectionCard
      icon={UserRound}
      title="Personal Information"
      description="Update your personal details and contact information."
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <ProfileField
          label="Full Name"
          required
          value={form.fullName}
          onChange={(event) => onChange("fullName", event.target.value)}
          placeholder="Enter full name"
        />
        <ProfileField
          label="Email Address"
          required
          type="email"
          value={form.personalEmail}
          onChange={(event) => onChange("personalEmail", event.target.value)}
          placeholder={getUniversityEmail(user) || "Enter email address"}
        />
        <ProfileField label="Designation" required value={roleFields.designation} disabled />
        <ProfileField label="Department" required value={roleFields.department} disabled />
        <ProfileField label="Role" value={getRoleLabel(getPrimaryRole(user))} disabled />
        <ProfileField label="Employee ID" required value={getInstitutionId(user)} disabled />

        <ProfileField
          as="textarea"
          className="md:col-span-2"
          label="Bio"
          value={form.bio}
          onChange={(event) => onChange("bio", event.target.value)}
          placeholder="Add a short professional bio"
          maxLength={250}
        />

        {status ? (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--info)_26%,white)] bg-[color-mix(in_srgb,var(--info)_8%,white)] px-4 py-3 text-sm font-semibold text-[var(--university-blue)] md:col-span-2">
            {status}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-5 sm:flex-row sm:justify-end md:col-span-2">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-5 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </ProfileSectionCard>
  );
};

export default ProfileDetailsForm;
