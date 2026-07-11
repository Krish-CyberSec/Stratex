import { BookOpenCheck, Edit3, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getPrograms } from "../../../services/programService";
import { getSemesters } from "../../../services/semesterService";
import { getSpecializations } from "../../../services/specializationService";
import { getSubjectById, updateSubject } from "../../../services/subjectService";
import SubjectDetailHeader from "./components/detail/SubjectDetailHeader";
import SubjectDetailSidebar from "./components/detail/SubjectDetailSidebar";
import SubjectEditPanel from "./components/detail/SubjectEditPanel";
import SubjectFacultyCard from "./components/detail/SubjectFacultyCard";
import SubjectHeroCard from "./components/detail/SubjectHeroCard";
import SubjectOverviewPanels from "./components/detail/SubjectOverviewPanels";
import SubjectQuickLinks from "./components/detail/SubjectQuickLinks";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getPayload = (response) => response?.data?.subject || response?.data?.data || response?.data;
const getList = (response) => response?.data?.data || [];
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const getInitialForm = (subject = {}) => ({
  code: subject.code || "",
  name: subject.name || "",
  description: subject.description || "",
  schoolId: getId(subject.schoolId),
  programId: getId(subject.programId),
  semesterId: getId(subject.semesterId),
  specializationId: getId(subject.specializationId),
  credits: subject.credits ?? 0,
  status: subject.status || "active",
});

const EmptyTabPanel = ({ tab }) => (
  <section className="rounded-xl border border-dashed border-[var(--border)] bg-white p-6 text-center shadow-sm">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
      <BookOpenCheck size={22} />
    </div>
    <h3 className="mt-3 text-sm font-black text-[var(--university-ink)]">{tab}</h3>
    <p className="mx-auto mt-1 max-w-md text-xs font-semibold leading-5 text-[var(--university-muted)]">
      This section will use the same subject detail layout when {tab.toLowerCase()} data is connected.
    </p>
  </section>
);

const SubjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subject, setSubject] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [form, setForm] = useState(getInitialForm());
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editStep, setEditStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes("superAdmin");
  const canManage = roles.includes("superAdmin") || roles.includes("schoolAdmin");

  const selectedProgram = useMemo(
    () => programs.find((program) => getId(program) === form.programId) || subject?.programId,
    [form.programId, programs, subject?.programId],
  );
  const selectedSemester = useMemo(
    () => semesters.find((semester) => getId(semester) === form.semesterId) || subject?.semesterId,
    [form.semesterId, semesters, subject?.semesterId],
  );
  const selectedSpecialization = useMemo(
    () =>
      specializations.find((specialization) => getId(specialization) === form.specializationId) ||
      subject?.specializationId,
    [form.specializationId, specializations, subject?.specializationId],
  );

  const canSubmit = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      Number(form.credits) >= 0 &&
      (!isSuperAdmin || (form.code.trim().length >= 2 && form.programId && form.semesterId)) &&
      !saving,
    [form.code, form.credits, form.name, form.programId, form.semesterId, isSuperAdmin, saving],
  );

  const loadSubject = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSubjectById(id);
      const payload = getPayload(response);
      setSubject(payload);
      setForm(getInitialForm(payload));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load subject details"));
      setSubject(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSubject();
  }, [loadSubject]);

  useEffect(() => {
    if (!isEditing || !isSuperAdmin) return;

    const loadPrograms = async () => {
      try {
        const response = await getPrograms({
          page: 1,
          limit: 100,
          sortBy: "name",
          order: "asc",
        });
        setPrograms(getList(response));
      } catch {
        setPrograms([]);
      }
    };

    loadPrograms();
  }, [isEditing, isSuperAdmin]);

  useEffect(() => {
    if (!isEditing || !isSuperAdmin || !form.programId) {
      if (!form.programId) {
        setSemesters([]);
        setSpecializations([]);
      }
      return;
    }

    const loadContext = async () => {
      try {
        const [semesterResponse, specializationResponse] = await Promise.all([
          getSemesters({ page: 1, limit: 50, programId: form.programId, sortBy: "semesterNumber", order: "asc" }),
          getSpecializations({ page: 1, limit: 100, programId: form.programId, sortBy: "name", order: "asc" }),
        ]);
        setSemesters(getList(semesterResponse));
        setSpecializations(getList(specializationResponse));
      } catch {
        setSemesters([]);
        setSpecializations([]);
      }
    };

    loadContext();
  }, [form.programId, isEditing, isSuperAdmin]);

  const updateField = (field, value) => {
    setForm((current) => {
      if (field === "programId") {
        const program = programs.find((item) => getId(item) === value);
        return {
          ...current,
          programId: value,
          schoolId: getId(program?.schoolId) || "",
          semesterId: "",
          specializationId: "",
        };
      }

      return { ...current, [field]: value };
    });
  };

  const startEditing = () => {
    setEditError("");
    setActiveTab("Overview");
    setForm(getInitialForm(subject));
    setEditStep(1);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditError("");
    setForm(getInitialForm(subject));
    setEditStep(1);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setEditError("");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        credits: Number(form.credits),
        status: form.status,
      };

      if (isSuperAdmin) {
        const programSchoolId = getId(selectedProgram?.schoolId) || form.schoolId;

        payload.code = form.code.trim().toUpperCase();
        payload.programId = form.programId;
        payload.schoolId = programSchoolId;
        payload.semesterId = form.semesterId;
        payload.specializationId = form.specializationId || "";
      }

      await updateSubject(id, payload);
      setIsEditing(false);
      setEditStep(1);
      await loadSubject();
    } catch (err) {
      setEditError(getErrorMessage(err, "Unable to update subject"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1480px] space-y-4">
          <div className="h-16 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="h-36 animate-pulse rounded-xl bg-white shadow-sm" />
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="h-72 animate-pulse rounded-xl bg-white shadow-sm" />
                <div className="h-72 animate-pulse rounded-xl bg-white shadow-sm" />
              </div>
            </div>
            <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[720px] rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-[var(--error)]">{error || "Subject not found"}</p>
          <button
            type="button"
            onClick={loadSubject}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <SubjectDetailHeader
          subject={subject}
          onBack={() => (isEditing ? cancelEditing() : navigate("/dashboard/subjects"))}
          actions={
            canManage ? (
              isEditing ? (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
                >
                  <X size={15} />
                  Cancel Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
                >
                  <Edit3 size={15} />
                  Edit Mode
                </button>
              )
            ) : null
          }
        />

        {isEditing ? (
          <SubjectEditPanel
            canSubmit={canSubmit}
            error={editError}
            form={form}
            isSuperAdmin={isSuperAdmin}
            onCancel={cancelEditing}
            onChange={updateField}
            onSubmit={handleSave}
            programs={programs}
            saving={saving}
            selectedProgram={selectedProgram}
            selectedSemester={selectedSemester}
            selectedSpecialization={selectedSpecialization}
            semesters={semesters}
            step={editStep}
            setStep={setEditStep}
            specializations={specializations}
            subject={subject}
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <main className="min-w-0 space-y-4">
              <SubjectHeroCard activeTab={activeTab} onTabChange={setActiveTab} subject={subject} />

              {activeTab === "Overview" ? (
                <>
                  <SubjectOverviewPanels subject={subject} />
                  <SubjectFacultyCard subject={subject} />
                  <SubjectQuickLinks />
                </>
              ) : (
                <EmptyTabPanel tab={activeTab} />
              )}
            </main>

            <SubjectDetailSidebar subject={subject} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectView;
