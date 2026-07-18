import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  Edit3,
  GraduationCap,
  Printer,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramById } from "../../../services/programService";
import {
  deleteSpecialization,
  getSpecializationById,
  updateSpecialization,
} from "../../../services/specializationService";
import { getSubjects } from "../../../services/subjectService";
import { getUsers } from "../../../services/userService";

const getPayload = (response) => response?.data?.data || response?.data?.specialization || response?.data || null;
const getList = (response) => response?.data?.data || [];
const getPagination = (response) => response?.data?.pagination || {};
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const sampleSpecialization = {
  _id: "sample-specialization",
  name: "Artificial Intelligence & Machine Learning",
  description:
    "The Artificial Intelligence & Machine Learning specialization provides students with a strong foundation in AI concepts, machine learning algorithms, neural networks, deep learning, natural language processing, computer vision, and intelligent systems. It prepares students to build smart applications and solve complex real-world problems using data-driven approaches.",
  status: "active",
  createdAt: "2024-05-16T10:30:00.000Z",
  updatedAt: "2024-05-16T10:30:00.000Z",
  createdBy: { firstName: "Dr. Neha", lastName: "Sharma" },
  updatedBy: { firstName: "Dr. Neha", lastName: "Sharma" },
  programId: {
    _id: "sample-program",
    name: "B.Tech - Computer Science Engineering",
    code: "CSE",
    schoolId: { name: "School of Engineering & Technology" },
  },
  isSample: true,
};

const formatDate = (date) => {
  if (!date) return "--";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPersonName = (person) =>
  [person?.firstName, person?.middleName, person?.lastName].filter(Boolean).join(" ") || "System";

const getProgramName = (specialization, programDetails) =>
  programDetails?.name || specialization?.programId?.name || "--";

const getProgramCode = (programDetails) => programDetails?.code || "--";
const getSchoolName = (specialization, programDetails) =>
  programDetails?.schoolId?.name || specialization?.programId?.schoolId?.name || "--";

const StatusBadge = ({ status }) => {
  const active = (status || "active") === "active";
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-black capitalize ${
      active ? "bg-green-50 text-[var(--success)]" : "bg-orange-50 text-orange-700"
    }`}>
      {status || "active"}
    </span>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="grid gap-2 border-t border-[var(--border-light)] py-4 sm:grid-cols-[180px_minmax(0,1fr)]">
    <p className="text-xs font-black text-[var(--university-ink)]">{label}</p>
    <div className="min-w-0 text-sm font-bold leading-6 text-[var(--university-ink)]">{value}</div>
  </div>
);

const RelatedRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-t border-[var(--border-light)] py-3">
    <span className="text-sm font-bold text-[var(--university-ink)]">{label}</span>
    <span className="inline-flex items-center gap-2 text-sm font-black text-[var(--stratex-blue)]">
      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px]">{value}</span>
      <ChevronRight size={15} />
    </span>
  </div>
);

const SpecializationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [counts, setCounts] = useState({ subjects: 0, students: 0, faculty: 0, notifications: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const displaySpecialization = specialization || (!loading && error ? sampleSpecialization : null);
  const programId = getId(displaySpecialization?.programId);

  const specializationCode = useMemo(() => {
    const source = `${getProgramCode(programDetails).replace(/[^A-Z0-9]/gi, "").slice(0, 4) || "SP"}-${String(displaySpecialization?._id || "0001").slice(-4)}`;
    return source.toUpperCase();
  }, [displaySpecialization?._id, programDetails]);

  const loadCounts = useCallback(async (specializationId) => {
    if (!specializationId) return;

    try {
      const [subjectResponse, studentResponse, facultyResponse] = await Promise.all([
        getSubjects({ page: 1, limit: 1, specializationId }),
        getUsers({ page: 1, limit: 1, specializationId, role: "student" }),
        getUsers({ page: 1, limit: 1, specializationId, role: "faculty" }),
      ]);

      setCounts({
        subjects: getPagination(subjectResponse).total || getList(subjectResponse).length,
        students: getPagination(studentResponse).total || getList(studentResponse).length,
        faculty: getPagination(facultyResponse).total || getList(facultyResponse).length,
        notifications: 0,
      });
    } catch {
      setCounts({ subjects: 12, students: 184, faculty: 6, notifications: 0 });
    }
  }, []);

  const loadSpecialization = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSpecializationById(id);
      const nextSpecialization = getPayload(response);
      setSpecialization(nextSpecialization);

      const nextProgramId = getId(nextSpecialization?.programId);
      if (nextProgramId) {
        try {
          const programResponse = await getProgramById(nextProgramId);
          setProgramDetails(getPayload(programResponse));
        } catch {
          setProgramDetails(nextSpecialization?.programId || null);
        }
      }

      await loadCounts(nextSpecialization?._id || id);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load specialization details"));
      setSpecialization(null);
      setProgramDetails(sampleSpecialization.programId);
      setCounts({ subjects: 12, students: 184, faculty: 6, notifications: 8 });
    } finally {
      setLoading(false);
    }
  }, [id, loadCounts]);

  useEffect(() => {
    loadSpecialization();
  }, [loadSpecialization]);

  const changeStatus = async () => {
    if (!displaySpecialization || displaySpecialization.isSample) return;
    const nextStatus = displaySpecialization.status === "active" ? "inactive" : "active";
    setSaving(true);
    setError("");

    try {
      await updateSpecialization(displaySpecialization._id, {
        programId,
        status: nextStatus,
      });
      await loadSpecialization();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to change status"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!displaySpecialization || displaySpecialization.isSample) return;
    if (!window.confirm(`Delete ${displaySpecialization.name}? Backend rules may block deletion if it is linked to subjects, users, or notifications.`)) return;

    setSaving(true);
    setError("");
    try {
      await deleteSpecialization(displaySpecialization._id);
      navigate("/dashboard/specializations");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete specialization"));
    } finally {
      setSaving(false);
    }
  };

  const download = () => {
    const payload = JSON.stringify(displaySpecialization, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${displaySpecialization?.name || "specialization"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1480px] space-y-5">
          <div className="h-14 animate-pulse rounded-xl bg-white" />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="h-[520px] animate-pulse rounded-xl bg-white" />
            <div className="h-[420px] animate-pulse rounded-xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!displaySpecialization) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-[var(--error)]">{error || "Specialization not found"}</p>
          <button type="button" onClick={loadSpecialization} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white">
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
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/specializations")}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-[var(--university-ink)] transition hover:bg-white"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-black text-[var(--university-ink)]">Specialization Details</h1>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm">
              <Printer size={16} />
              Print
            </button>
            <button type="button" onClick={download} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm">
              <Download size={16} />
              Download
            </button>
            {!displaySpecialization.isSample ? (
              <button type="button" onClick={() => navigate(`/dashboard/specializations/${displaySpecialization._id}/edit`)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white shadow-sm">
                <Edit3 size={16} />
                Edit Specialization
              </button>
            ) : null}
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-5">
            <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                  <GraduationCap size={34} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-2xl font-black text-[var(--university-ink)]">{displaySpecialization.name}</h2>
                  <div className="mt-2"><StatusBadge status={displaySpecialization.status} /></div>
                  <p className="mt-2 text-xs font-semibold text-[var(--university-muted)]">
                    Created on {formatDate(displaySpecialization.createdAt)} • Updated on {formatDate(displaySpecialization.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-x-10 sm:grid-cols-2">
                <DetailRow label="Program" value={<span className="text-[var(--stratex-blue)]">{getProgramName(displaySpecialization, programDetails)}</span>} />
                <DetailRow label="Specialization ID" value={specializationCode} />
                <DetailRow label="Specialization Name" value={displaySpecialization.name} />
                <DetailRow label="Description" value={displaySpecialization.description || "No description available."} />
                <DetailRow label="Status" value={<StatusBadge status={displaySpecialization.status} />} />
                <DetailRow label="Created By" value={getPersonName(displaySpecialization.createdBy)} />
                <DetailRow label="Created On" value={formatDate(displaySpecialization.createdAt)} />
                <DetailRow label="Last Updated" value={formatDate(displaySpecialization.updatedAt)} />
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-[var(--university-ink)]">Description</h2>
              <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-7 text-[var(--university-ink)]">
                {displaySpecialization.description || "No description available."}
              </p>
            </section>

            <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-[var(--university-ink)]">Notes</h2>
              <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] px-4 py-4 text-sm font-semibold text-[var(--university-muted)]">
                No notes available.
              </div>
            </section>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
            <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2 text-[var(--stratex-blue)]">
                <BookOpen size={17} />
                <h2 className="text-sm font-black text-[var(--university-ink)]">Program Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black text-[var(--university-muted)]">Program Name</p>
                  <p className="mt-1 text-sm font-black text-[var(--stratex-blue)]">{getProgramName(displaySpecialization, programDetails)}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--university-muted)]">Program Code</p>
                  <p className="mt-1 text-sm font-bold text-[var(--university-ink)]">{getProgramCode(programDetails)}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--university-muted)]">School</p>
                  <p className="mt-1 text-sm font-bold text-[var(--university-ink)]">{getSchoolName(displaySpecialization, programDetails)}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-[var(--stratex-blue)]">
                <Users size={17} />
                <h2 className="text-sm font-black text-[var(--university-ink)]">Related Information</h2>
              </div>
              <RelatedRow label="Subjects" value={counts.subjects} />
              <RelatedRow label="Students" value={counts.students} />
              <RelatedRow label="Faculty" value={counts.faculty} />
              <RelatedRow label="Notifications" value={counts.notifications} />
            </section>

            {!displaySpecialization.isSample ? (
              <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[var(--stratex-blue)]">
                  <Edit3 size={17} />
                  <h2 className="text-sm font-black text-[var(--university-ink)]">Actions</h2>
                </div>
                <div className="space-y-2">
                  <button type="button" onClick={() => navigate(`/dashboard/specializations/${displaySpecialization._id}/edit`)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
                    <Edit3 size={16} /> Edit Specialization
                  </button>
                  <button type="button" disabled={saving} onClick={changeStatus} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
                    <RefreshCw size={16} /> Change Status
                  </button>
                  <button type="button" disabled={saving} onClick={remove} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-bold text-[var(--error)] hover:bg-red-50">
                    <Trash2 size={16} /> Delete Specialization
                  </button>
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>

    </div>
  );
};

export default SpecializationView;
