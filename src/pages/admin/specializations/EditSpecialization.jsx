import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getPrograms } from "../../../services/programService";
import {
  getSpecializationById,
  updateSpecialization,
} from "../../../services/specializationService";
import {
  AboutCard,
  BasicStep,
  DetailsStep,
  getErrorMessage,
  getId,
  getList,
  initialForm,
  Navigation,
  ProgressCard,
  ReviewStep,
  samplePrograms,
  SettingsStep,
  Stepper,
} from "./CreateSpecialization";

const getPayload = (response) => response?.data?.data || response?.data?.specialization || response?.data || null;

const toForm = (specialization = {}) => ({
  programId: getId(specialization.programId),
  name: specialization.name || "",
  description: specialization.description || "",
  status: specialization.status || "active",
  allowSubjectReference: true,
});

const EditSpecialization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState("");
  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");
  const ownSchoolId = getId(user?.schoolId);

  const loadPage = useCallback(async () => {
    setLoadingPage(true);
    setError("");

    try {
      const [programResponse, specializationResponse] = await Promise.all([
        getPrograms({
          page: 1,
          limit: 200,
          sortBy: "name",
          order: "asc",
          ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
        }),
        getSpecializationById(id),
      ]);

      const nextPrograms = getList(programResponse);
      const specialization = getPayload(specializationResponse);
      setPrograms(nextPrograms);
      setForm(toForm(specialization));
    } catch (err) {
      setPrograms([]);
      setError(getErrorMessage(err, "Unable to load specialization for editing"));
    } finally {
      setLoadingPage(false);
    }
  }, [id, isSchoolAdmin, ownSchoolId]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

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

  const save = async () => {
    if (!canGoNext) return;
    setLoading(true);
    setError("");

    try {
      await updateSpecialization(id, {
        programId: form.programId,
        name: form.name.trim(),
        description: form.description.trim() || "No description provided.",
        status: form.status,
      });
      navigate(`/dashboard/specializations/${id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update specialization"));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (currentStep === 1) return <BasicStep form={form} programs={displayPrograms} onChange={update} />;
    if (currentStep === 2) return <DetailsStep form={form} onChange={update} />;
    if (currentStep === 3) return <SettingsStep form={form} onChange={update} />;
    return <ReviewStep form={form} programs={displayPrograms} mode="edit" />;
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
            <span className="text-[var(--university-ink)]">Edit Specialization</span>
          </div>
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/specializations/${id}`)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black leading-tight text-[var(--university-ink)]">Edit Specialization</h1>
              <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
                Update specialization details with the same guided process.
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        {loadingPage ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-[var(--stratex-blue)]">
            Loading specialization...
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <Stepper currentStep={currentStep} />
            <div>{renderStep()}</div>
            <Navigation
              canGoNext={canGoNext && !loadingPage}
              currentStep={currentStep}
              loading={loading}
              loadingLabel="Saving..."
              onBack={() => setCurrentStep((step) => Math.max(1, step - 1))}
              onCancel={() => navigate(`/dashboard/specializations/${id}`)}
              onCreate={save}
              onNext={() => setCurrentStep((step) => Math.min(4, step + 1))}
              submitLabel="Save Changes"
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

export default EditSpecialization;
