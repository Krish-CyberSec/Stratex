import { ArrowLeft, ArrowRight, Check, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getPrograms } from "../../../services/programService";
import { getSemesters } from "../../../services/semesterService";
import { getSpecializations } from "../../../services/specializationService";
import { createSubject } from "../../../services/subjectService";
import SubjectCreateSide from "./components/create/SubjectCreateSide";
import SubjectCreateStepper from "./components/create/SubjectCreateStepper";

const getList = (response) => response.data?.data || [];
const getId = (value) => value?._id || value?.id || "";
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const initialForm = {
  programId: "",
  semesterId: "",
  specializationId: "",
  code: "",
  name: "",
  description: "",
  credits: 0,
  status: "active",
};

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
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--university-muted)]">{row.label}</p>
        <p className="mt-1 text-sm font-bold text-[var(--university-ink)]">{row.value || "--"}</p>
      </div>
    ))}
  </div>
);

const CreateSubject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const ownSchoolId = typeof user?.schoolId === "object" ? getId(user.schoolId) : user?.schoolId;
  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await getPrograms({
          page: 1,
          limit: 100,
          sortBy: "name",
          order: "asc",
          ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
        });
        const list = getList(response);
        setPrograms(list);
        setForm((current) => ({ ...current, programId: current.programId || getId(list[0]) || "" }));
      } catch {
        setPrograms([]);
      }
    };

    loadPrograms();
  }, [isSchoolAdmin, ownSchoolId]);

  useEffect(() => {
    if (!form.programId) {
      setSemesters([]);
      setSpecializations([]);
      return;
    }

    const loadContext = async () => {
      const [semesterResponse, specializationResponse] = await Promise.all([
        getSemesters({ page: 1, limit: 50, programId: form.programId, sortBy: "semesterNumber", order: "asc" }),
        getSpecializations({ page: 1, limit: 100, programId: form.programId, sortBy: "name", order: "asc" }),
      ]);
      const nextSemesters = getList(semesterResponse);
      const nextSpecializations = getList(specializationResponse);

      setSemesters(nextSemesters);
      setSpecializations(nextSpecializations);
      setForm((current) => ({
        ...current,
        semesterId: nextSemesters.some((item) => getId(item) === current.semesterId)
          ? current.semesterId
          : getId(nextSemesters[0]) || "",
        specializationId: nextSpecializations.some((item) => getId(item) === current.specializationId)
          ? current.specializationId
          : "",
      }));
    };

    loadContext().catch(() => {
      setSemesters([]);
      setSpecializations([]);
    });
  }, [form.programId]);

  const selectedProgram = useMemo(() => programs.find((program) => getId(program) === form.programId), [form.programId, programs]);
  const selectedSemester = useMemo(() => semesters.find((semester) => getId(semester) === form.semesterId), [form.semesterId, semesters]);
  const selectedSpecialization = useMemo(
    () => specializations.find((specialization) => getId(specialization) === form.specializationId),
    [form.specializationId, specializations],
  );

  const canStep1 = Boolean(form.programId && form.semesterId);
  const canStep2 = form.code.trim().length >= 2 && form.name.trim().length >= 2 && Number(form.credits) >= 0;
  const canContinue = step === 1 ? canStep1 : step === 2 ? canStep2 : true;

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const reviewRows = [
    { label: "Subject Code", value: form.code || "Not set" },
    { label: "Subject Name", value: form.name || "Not set" },
    { label: "Type", value: selectedSpecialization ? "Specialization" : "Core" },
    { label: "Credits", value: form.credits },
    { label: "Program", value: selectedProgram?.name },
    { label: "Semester", value: selectedSemester ? `Semester ${selectedSemester.semesterNumber}` : "" },
    { label: "Specialization", value: selectedSpecialization?.name || "Common Curriculum" },
    { label: "Status", value: form.status },
  ];

  const sideSummary = [
    { label: "Program", value: selectedProgram?.name },
    { label: "Semester", value: selectedSemester ? `Semester ${selectedSemester.semesterNumber}` : "" },
    { label: "Specialization", value: selectedSpecialization?.name || "Common Curriculum" },
    { label: "Credits", value: form.credits },
  ];

  const submit = async () => {
    setSaving(true);
    setError("");

    try {
      await createSubject({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim(),
        credits: Number(form.credits),
        status: form.status,
        schoolId: selectedProgram?.schoolId?._id || selectedProgram?.schoolId,
        programId: form.programId,
        semesterId: form.semesterId,
        specializationId: form.specializationId || undefined,
      });
      navigate("/dashboard/subjects");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to add subject"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>My Subjects</span>
              <span>/</span>
              <span className="text-[var(--university-ink)]">Add Subject</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-[var(--text-primary)]">Add Subject</h1>
            <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
              Select academic details and add a new subject to Semester {selectedSemester?.semesterNumber || "-"}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/subjects")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm hover:bg-[var(--surface-soft)]"
          >
            <ArrowLeft size={16} />
            Back to Subjects
          </button>
        </header>

        <SubjectCreateStepper step={step} />

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
                  <h2 className="text-lg font-bold text-[var(--university-ink)]">Select Academic Context</h2>
                  <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
                    Choose the academic details under which you want to add the subject.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Program" required>
                    <select value={form.programId} onChange={(event) => update("programId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                      <option value="">Select program</option>
                      {programs.map((program) => (
                        <option key={getId(program)} value={getId(program)}>{program.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Semester" required>
                    <select value={form.semesterId} onChange={(event) => update("semesterId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                      <option value="">Select semester</option>
                      {semesters.map((semester) => (
                        <option key={getId(semester)} value={getId(semester)}>Semester {semester.semesterNumber}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Specialization">
                    <select value={form.specializationId} onChange={(event) => update("specializationId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                      <option value="">Common Curriculum</option>
                      {specializations.map((specialization) => (
                        <option key={getId(specialization)} value={getId(specialization)}>{specialization.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] px-4 py-3 text-xs font-semibold text-[var(--stratex-blue)]">
                  You can add subjects only to an existing program semester.
                </div>
                <DetailGrid rows={[
                  { label: "Program", value: selectedProgram?.name },
                  { label: "Semester", value: selectedSemester ? `Semester ${selectedSemester.semesterNumber}` : "" },
                  { label: "Specialization", value: selectedSpecialization?.name || "Common Curriculum" },
                  { label: "Status", value: "Active" },
                ]} />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--university-ink)]">Select Subject</h2>
                  <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">Enter the subject that should be added.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Subject Code" required value={form.code} onChange={(event) => update("code", event.target.value.toUpperCase())} placeholder="CSE303" />
                  <Field label="Credits" type="number" min="0" value={form.credits} onChange={(event) => update("credits", event.target.value)} />
                  <Field label="Subject Name" required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Computer Organization and Architecture" />
                  <Field label="Status">
                    <select value={form.status} onChange={(event) => update("status", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field as="textarea" label="Description" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Study of computer architecture, CPU organization, memory hierarchy..." />
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[var(--university-ink)]">Review Subject Details</h2>
                  <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">Please verify the information before adding the subject.</p>
                </div>
                <DetailGrid rows={reviewRows} />
                <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
                  <h3 className="text-sm font-bold text-[var(--university-ink)]">Description</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-[var(--text-secondary)]">{form.description || "No description provided."}</p>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--university-ink)]">
                    <ShieldCheck size={20} className="text-[var(--success)]" />
                    Confirm & Add Subject
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">Please review all details below. Once confirmed, the subject will be added.</p>
                </div>
                <div className="rounded-xl bg-green-50 px-4 py-3 text-xs font-bold text-[var(--success)]">
                  All details look good. You are ready to add this subject.
                </div>
                <DetailGrid rows={reviewRows} />
              </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => (step === 1 ? navigate("/dashboard/subjects") : setStep((current) => current - 1))}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]"
              >
                <ArrowLeft size={16} />
                {step === 1 ? "Cancel" : "Back"}
              </button>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {step > 1 ? (
                  <button type="button" onClick={() => navigate("/dashboard/subjects")} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
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
                    disabled={saving}
                    onClick={submit}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Adding..." : "Add Subject"}
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          </main>

          <SubjectCreateSide summary={sideSummary} />
        </div>
      </div>
    </div>
  );
};

export default CreateSubject;
