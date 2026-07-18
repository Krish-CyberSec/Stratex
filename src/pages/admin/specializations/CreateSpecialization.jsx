import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  GraduationCap,
  Info,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getPrograms } from "../../../services/programService";
import { createSpecialization } from "../../../services/specializationService";

export const getList = (response) => response?.data?.data || [];
export const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");
export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

export const steps = [
  { id: 1, title: "Basic Information", subtitle: "Select program and enter name" },
  { id: 2, title: "Details", subtitle: "Add description" },
  { id: 3, title: "Status & Settings", subtitle: "Set status and preferences" },
  { id: 4, title: "Review", subtitle: "Review and confirm" },
];

export const initialForm = {
  programId: "",
  name: "",
  description: "",
  status: "active",
  allowSubjectReference: true,
};

export const samplePrograms = [
  { _id: "sample-cse", name: "B.Tech - Computer Science Engineering", isSample: true },
  { _id: "sample-mba", name: "MBA - Business Administration", isSample: true },
];

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-black capitalize ${
    status === "active" ? "bg-green-50 text-[var(--success)]" : "bg-orange-50 text-orange-700"
  }`}>
    {status}
  </span>
);

export const Stepper = ({ currentStep }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-6 shadow-sm sm:px-8">
    <div className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => {
        const complete = currentStep > step.id;
        const active = currentStep === step.id;

        return (
          <div key={step.id} className="relative flex flex-col items-center text-center">
            {index < steps.length - 1 ? (
              <span className={`absolute left-1/2 top-5 h-0.5 w-full ${currentStep > step.id ? "bg-[var(--stratex-blue)]" : "bg-[var(--border-light)]"}`} />
            ) : null}
            <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${
              complete || active
                ? "bg-[var(--stratex-blue)] text-white shadow-sm"
                : "bg-slate-100 text-[var(--university-muted)]"
            }`}>
              {complete ? <Check size={17} /> : step.id}
            </span>
            <p className={`mt-4 text-xs font-black ${active ? "text-[var(--stratex-blue)]" : "text-[var(--university-ink)]"}`}>
              {step.title}
            </p>
            <p className="mt-1 hidden max-w-28 text-xs font-semibold leading-5 text-[var(--university-muted)] sm:block">
              {step.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);

export const AboutCard = () => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[var(--stratex-blue)]">
        <GraduationCap size={19} />
      </span>
      <h2 className="text-sm font-black text-[var(--university-ink)]">About Specializations</h2>
    </div>
    <ul className="mt-5 space-y-4">
      {[
        "Specializations belong to programs.",
        "They do not own semesters.",
        "Creating a specialization will not generate semesters.",
        "Subjects can optionally reference a specialization.",
        "You cannot delete a specialization if it is linked to subjects, users, or notifications.",
      ].map((item) => (
        <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-[var(--university-ink)]">
          <CheckCircle2 className="mt-1 shrink-0 text-[var(--stratex-blue)]" size={15} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

export const ProgressCard = ({ currentStep }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[var(--stratex-blue)]">
        <ArrowRight size={18} />
      </span>
      <h2 className="text-sm font-black text-[var(--university-ink)]">Progress</h2>
    </div>
    <div className="mt-5 space-y-4">
      {steps.map((step) => {
        const complete = currentStep > step.id;
        const active = currentStep === step.id;

        return (
          <div key={step.id} className="flex gap-3">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
              complete || active
                ? "bg-[var(--stratex-blue)] text-white"
                : "bg-slate-100 text-[var(--university-muted)]"
            }`}>
              {complete ? <Check size={13} /> : step.id}
            </span>
            <div>
              <p className={`text-xs font-black ${active ? "text-[var(--stratex-blue)]" : "text-[var(--university-ink)]"}`}>
                {step.title}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">{step.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export const InfoBox = ({ title = "Note", children }) => (
  <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-4">
    <Info className="mt-0.5 shrink-0 text-[var(--stratex-blue)]" size={18} />
    <div>
      <p className="text-sm font-black text-[var(--university-ink)]">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--university-muted)]">{children}</p>
    </div>
  </div>
);

export const FieldShell = ({ children, step, subtitle, title }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-7">
    <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black text-[var(--stratex-blue)]">
      Step {step} of 4
    </span>
    <h2 className="mt-4 text-2xl font-black text-[var(--university-ink)]">{title}</h2>
    <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">{subtitle}</p>
    <div className="mt-7">{children}</div>
  </section>
);

export const BasicStep = ({ form, programs, onChange }) => (
  <FieldShell step={1} title="Basic Information" subtitle="Select the program and provide a unique name for the specialization.">
    <div className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Program <span className="text-[var(--error)]">*</span></span>
        <select
          value={form.programId}
          onChange={(event) => onChange("programId", event.target.value)}
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        >
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={getId(program)} value={getId(program)} disabled={program.isSample}>
              {program.name}{program.isSample ? " (sample)" : ""}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs font-semibold text-[var(--university-muted)]">Specialization must belong to a program.</p>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Specialization Name <span className="text-[var(--error)]">*</span></span>
        <div className="relative">
          <input
            maxLength={150}
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Enter specialization name"
            className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 pr-16 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[var(--university-muted)]">{form.name.length}/150</span>
        </div>
        <p className="mt-2 text-xs font-semibold text-[var(--university-muted)]">Enter a unique name for the specialization within the selected program.</p>
      </label>

      <InfoBox>Specialization names must be unique within the selected program.</InfoBox>
    </div>
  </FieldShell>
);

export const DetailsStep = ({ form, onChange }) => (
  <FieldShell step={2} title="Details" subtitle="Provide a short description for the specialization.">
    <div className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Description <span className="font-semibold text-[var(--university-muted)]">(Optional)</span></span>
        <div className="relative">
          <textarea
            maxLength={500}
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Enter description about the specialization"
            className="min-h-36 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[var(--stratex-blue)]"
          />
          <span className="absolute bottom-3 right-3 text-[11px] font-bold text-[var(--university-muted)]">{form.description.length}/500</span>
        </div>
        <p className="mt-2 text-xs font-semibold text-[var(--university-muted)]">Describe the focus, objectives or key areas covered in this specialization.</p>
      </label>

      <InfoBox title="Tip">A clear description helps students and faculty understand the specialization better.</InfoBox>
    </div>
  </FieldShell>
);

export const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-[var(--stratex-blue)]" : "bg-slate-200"}`}
  >
    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
  </button>
);

export const SettingsStep = ({ form, onChange }) => (
  <FieldShell step={3} title="Status & Settings" subtitle="Configure the status and additional settings for the specialization.">
    <div className="space-y-6">
      <label className="block">
        <span className="mb-1 block text-xs font-black text-[var(--university-ink)]">Status <span className="text-[var(--error)]">*</span></span>
        <p className="mb-2 text-xs font-semibold text-[var(--university-muted)]">Select the current status of this specialization.</p>
        <select
          value={form.status}
          onChange={(event) => onChange("status", event.target.value)}
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <p className="mt-2 text-xs font-semibold text-[var(--university-muted)]">Only active specializations will be available for selection.</p>
      </label>

      <div>
        <p className="text-xs font-black text-[var(--university-ink)]">Allow Subject Reference</p>
        <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">Enable if subjects can reference this specialization.</p>
        <div className="mt-3 flex items-start gap-3">
          <Toggle checked={form.allowSubjectReference} onChange={(value) => onChange("allowSubjectReference", value)} />
          <div>
            <p className="text-sm font-black text-[var(--university-ink)]">Yes, allow subjects to reference this specialization</p>
            <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">
              Subjects will be able to reference this specialization while being created or updated.
            </p>
          </div>
        </div>
      </div>

      <InfoBox>You can change these settings later from the specialization details page.</InfoBox>
    </div>
  </FieldShell>
);

export const ReviewStep = ({ form, programs, mode = "create" }) => {
  const selectedProgram = programs.find((program) => getId(program) === form.programId);
  const rows = [
    ["Program", selectedProgram?.name || "Not selected"],
    ["Specialization Name", form.name || "Not provided"],
    ["Description", form.description || "Not provided"],
    ["Status", <StatusBadge status={form.status} />],
    ["Allow Subject Reference", form.allowSubjectReference ? "Yes" : "No"],
  ];

  return (
    <FieldShell step={4} title="Review & Confirm" subtitle="Please review all the details below before creating the specialization.">
      <div className="overflow-hidden rounded-xl border border-[var(--border-light)]">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 border-b border-[var(--border-light)] px-4 py-4 last:border-b-0 sm:grid-cols-[260px_minmax(0,1fr)]">
            <p className="text-sm font-black text-[var(--university-ink)]">{label}</p>
            <div className="text-sm font-bold leading-6 text-[var(--university-ink)]">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-4">
        <p className="text-sm font-black text-[var(--stratex-blue)]">Please Note</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--university-muted)]">
          {mode === "edit"
            ? "Once saved, the updated specialization details will be reflected across the dashboard."
            : "Once created, you can update the specialization details anytime from the specialization list."}
        </p>
      </div>
    </FieldShell>
  );
};

export const Navigation = ({
  canGoNext,
  currentStep,
  loading,
  loadingLabel = "Creating...",
  onBack,
  onCancel,
  onCreate,
  onNext,
  submitLabel = "Create Specialization",
}) => (
  <div className="flex flex-col-reverse gap-3 rounded-b-xl border-x border-b border-[var(--border-light)] bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
    <button
      type="button"
      onClick={currentStep === 1 ? onCancel : onBack}
      disabled={loading}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-5 text-sm font-bold text-[var(--university-ink)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)] disabled:opacity-60"
    >
      <ArrowLeft size={16} />
      {currentStep === 1 ? "Cancel" : "Back"}
    </button>
    <button
      type="button"
      onClick={currentStep === 4 ? onCreate : onNext}
      disabled={!canGoNext || loading}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-6 text-sm font-black text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? loadingLabel : currentStep === 4 ? submitLabel : "Next"}
      {currentStep === 4 ? <Plus size={16} /> : <ArrowRight size={16} />}
    </button>
  </div>
);

const CreateSpecialization = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [error, setError] = useState("");
  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");
  const ownSchoolId = getId(user?.schoolId);

  const loadPrograms = useCallback(async () => {
    setLoadingPrograms(true);
    try {
      const response = await getPrograms({
        page: 1,
        limit: 200,
        sortBy: "name",
        order: "asc",
        ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
      });
      setPrograms(getList(response));
    } catch {
      setPrograms([]);
    } finally {
      setLoadingPrograms(false);
    }
  }, [isSchoolAdmin, ownSchoolId]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const displayPrograms = programs.length ? programs : samplePrograms;
  const selectedProgram = programs.find((program) => getId(program) === form.programId);
  const hasRealProgram = Boolean(selectedProgram && !selectedProgram.isSample);

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return hasRealProgram && form.name.trim().length >= 2;
    if (currentStep === 2) return true;
    if (currentStep === 3) return ["active", "inactive"].includes(form.status);
    return hasRealProgram && form.name.trim().length >= 2;
  }, [currentStep, form.name, form.status, hasRealProgram]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const create = async () => {
    if (!canGoNext) return;
    setLoading(true);
    setError("");

    try {
      await createSpecialization({
        programId: form.programId,
        name: form.name.trim(),
        description: form.description.trim() || "No description provided.",
        status: form.status,
      });
      navigate("/dashboard/specializations");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create specialization"));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (currentStep === 1) return <BasicStep form={form} programs={displayPrograms} onChange={update} />;
    if (currentStep === 2) return <DetailsStep form={form} onChange={update} />;
    if (currentStep === 3) return <SettingsStep form={form} onChange={update} />;
    return <ReviewStep form={form} programs={displayPrograms} />;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Academic Management</span>
            <span>/</span>
            <span>Specializations</span>
            <span>/</span>
            <span className="text-[var(--university-ink)]">Add Specialization</span>
          </div>
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/specializations")}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black leading-tight text-[var(--university-ink)]">Add New Specialization</h1>
              <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
                Specializations belong to programs. They do not own semesters.
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        {loadingPrograms && !programs.length ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-[var(--stratex-blue)]">
            Loading programs...
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <Stepper currentStep={currentStep} />
            <div className="mt-0">{renderStep()}</div>
            <Navigation
              canGoNext={canGoNext}
              currentStep={currentStep}
              loading={loading}
              onBack={() => setCurrentStep((step) => Math.max(1, step - 1))}
              onCancel={() => navigate("/dashboard/specializations")}
              onCreate={create}
              onNext={() => setCurrentStep((step) => Math.min(4, step + 1))}
            />
          </main>

          <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
            <AboutCard />
            <ProgressCard currentStep={currentStep} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreateSpecialization;
