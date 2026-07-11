import { ArrowLeft, ArrowRight, Check, Lock, ShieldCheck, X } from "lucide-react";
import SubjectCreateSide from "../create/SubjectCreateSide";
import SubjectCreateStepper from "../create/SubjectCreateStepper";
import {
  getTypeLabel,
} from "./subjectDetailUtils";

const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const getProgramName = (program) => program?.name || "Not assigned";
const getSemesterLabel = (semester) =>
  semester?.name || (semester?.semesterNumber ? `Semester ${semester.semesterNumber}` : "Not assigned");
const getSpecializationName = (specialization) => specialization?.name || "Common Curriculum";

const Field = ({ as = "input", label, required, children, ...props }) => {
  const Control = as;

  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">
        {label} {required ? <span className="text-[var(--error)]">*</span> : null}
      </span>
      {children || (
        <Control
          {...props}
          className={`w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)] ${
            as === "textarea" ? "min-h-24 resize-y py-3" : "h-11"
          }`}
        />
      )}
    </label>
  );
};

const DetailGrid = ({ rows }) => (
  <div className="grid gap-4 rounded-xl border border-[var(--border-light)] bg-white p-4 md:grid-cols-2">
    {rows.map((row) => (
      <div key={row.label}>
        <p className="text-[11px] font-bold uppercase text-[var(--university-muted)]">{row.label}</p>
        <p className="mt-1 break-words text-sm font-bold text-[var(--university-ink)]">{row.value || "--"}</p>
      </div>
    ))}
  </div>
);

const SubjectEditPanel = ({
  canSubmit,
  error,
  form,
  isSuperAdmin,
  onCancel,
  onChange,
  onSubmit,
  programs,
  saving,
  selectedProgram,
  selectedSemester,
  selectedSpecialization,
  semesters,
  step,
  subject,
  setStep,
  specializations,
}) => {
  const reviewRows = [
    { label: "Subject Code", value: form.code || "Not set" },
    { label: "Subject Name", value: form.name || "Not set" },
    { label: "Type", value: form.specializationId ? "Specialization" : "Core" },
    { label: "Credits", value: form.credits },
    { label: "Program", value: getProgramName(selectedProgram) },
    { label: "Semester", value: getSemesterLabel(selectedSemester) },
    { label: "Specialization", value: getSpecializationName(selectedSpecialization) },
    { label: "Status", value: form.status },
  ];

  const sideSummary = [
    { label: "Program", value: getProgramName(selectedProgram) },
    { label: "Semester", value: getSemesterLabel(selectedSemester) },
    { label: "Specialization", value: getSpecializationName(selectedSpecialization) },
    { label: "Credits", value: form.credits },
  ];

  const canContinue =
    step === 1 && isSuperAdmin
      ? Boolean(form.programId && form.semesterId)
      : step === 2
        ? canSubmit
        : true;

  return (
    <div className="space-y-5">
      <SubjectCreateStepper mode="edit" step={step} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
        <main className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[var(--university-ink)]">Academic Context</h2>
                <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
                  {isSuperAdmin
                    ? "Update the assigned academic context for this subject."
                    : "Review the assigned academic context for this subject."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {isSuperAdmin ? (
                  <>
                    <Field label="Program" required>
                      <select
                        value={form.programId}
                        onChange={(event) => onChange("programId", event.target.value)}
                        className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
                      >
                        <option value="">Select program</option>
                        {programs.map((program) => (
                          <option key={getId(program)} value={getId(program)}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Semester" required>
                      <select
                        value={form.semesterId}
                        onChange={(event) => onChange("semesterId", event.target.value)}
                        className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
                      >
                        <option value="">Select semester</option>
                        {semesters.map((semester) => (
                          <option key={getId(semester)} value={getId(semester)}>
                            Semester {semester.semesterNumber}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Specialization">
                      <select
                        value={form.specializationId}
                        onChange={(event) => onChange("specializationId", event.target.value)}
                        className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
                      >
                        <option value="">Common Curriculum</option>
                        {specializations.map((specialization) => (
                          <option key={getId(specialization)} value={getId(specialization)}>
                            {specialization.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Program" required value={getProgramName(selectedProgram)} disabled />
                    <Field label="Semester" required value={getSemesterLabel(selectedSemester)} disabled />
                    <Field label="Specialization" value={getSpecializationName(selectedSpecialization)} disabled />
                  </>
                )}
              </div>

              <div className="flex gap-3 rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] px-4 py-3 text-xs font-semibold leading-5 text-[var(--stratex-blue)]">
                <Lock size={16} className="mt-0.5 shrink-0" />
                {isSuperAdmin
                  ? "Super admin can update academic context. Changing it may affect where the subject appears."
                  : "Academic context and subject code are locked after creation. Use the subject fields step to update editable information."}
              </div>

              <DetailGrid rows={[
                { label: "Program", value: getProgramName(selectedProgram) },
                { label: "Semester", value: getSemesterLabel(selectedSemester) },
                { label: "Specialization", value: getSpecializationName(selectedSpecialization) },
                { label: "Subject Type", value: form.specializationId ? "Specialization" : getTypeLabel(subject) },
              ]} />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[var(--university-ink)]">Edit Subject</h2>
                <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
                  Update the subject details that can be changed safely.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Subject Code"
                  required
                  value={form.code}
                  disabled={!isSuperAdmin}
                  onChange={(event) => onChange("code", event.target.value.toUpperCase())}
                />
                <Field
                  label="Credits"
                  required
                  type="number"
                  min="0"
                  value={form.credits}
                  onChange={(event) => onChange("credits", event.target.value)}
                />
                <Field
                  label="Subject Name"
                  required
                  value={form.name}
                  onChange={(event) => onChange("name", event.target.value)}
                  placeholder="Computer Organization and Architecture"
                />
                <Field label="Status" required>
                  <select
                    value={form.status}
                    onChange={(event) => onChange("status", event.target.value)}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field
                    as="textarea"
                    label="Description"
                    value={form.description}
                    onChange={(event) => onChange("description", event.target.value)}
                    placeholder="Study of computer architecture, CPU organization, memory hierarchy..."
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[var(--university-ink)]">Review Subject Details</h2>
                <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
                  Please verify the updated information before saving.
                </p>
              </div>
              <DetailGrid rows={reviewRows} />
              <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
                <h3 className="text-sm font-bold text-[var(--university-ink)]">Description</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-[var(--text-secondary)]">
                  {form.description || "No description provided."}
                </p>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--university-ink)]">
                  <ShieldCheck size={20} className="text-[var(--success)]" />
                  Confirm & Save Subject
                </h2>
                <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
                  Review all details below. Once confirmed, the subject will be updated.
                </p>
              </div>
              <div className="rounded-xl bg-green-50 px-4 py-3 text-xs font-bold text-[var(--success)]">
                All details look good. You are ready to save this subject.
              </div>
              <DetailGrid rows={reviewRows} />
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => (step === 1 ? onCancel() : setStep((current) => current - 1))}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]"
            >
              <ArrowLeft size={16} />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]"
                >
                  <X size={16} />
                  Cancel
                </button>
              ) : null}

              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((current) => current + 1)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving || !canSubmit}
                  onClick={onSubmit}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Subject"}
                  <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </main>

        <SubjectCreateSide mode="edit" summary={sideSummary} />
      </div>
    </div>
  );
};

export default SubjectEditPanel;
