import { BookOpenCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getPrograms } from "../../../services/programService";
import { deleteSubject, getSubjects } from "../../../services/subjectService";
import DeleteSubjectModal from "./components/DeleteSubjectModal";
import SubjectProgramSelector from "./components/SubjectProgramSelector";
import SubjectSemesterTabs from "./components/SubjectSemesterTabs";
import SubjectTable from "./components/SubjectTable";
import SubjectToolbar from "./components/SubjectToolbar";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getList = (response) => response.data?.data || [];
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");
const getSemesterNumber = (subject) => subject?.semesterId?.semesterNumber || subject?.semesterNumber || 1;

const getPrimaryAssignment = (user) =>
  user?.academicAssignments?.find((assignment) => assignment.isPrimary && assignment.status !== "inactive") ||
  user?.academicAssignments?.find((assignment) => assignment.status !== "inactive") ||
  user?.academicAssignments?.[0];

const buildSemesters = (program, subjects, programs) => {
  const programDuration = Number(program?.duration || 0);
  if (programDuration > 0) {
    return Array.from({ length: programDuration * 2 }, (_, index) => ({ semesterNumber: index + 1 }));
  }

  const maxProgramDuration = Math.max(...programs.map((item) => Number(item.duration || 0)), 0);
  if (maxProgramDuration > 0) {
    return Array.from({ length: maxProgramDuration * 2 }, (_, index) => ({ semesterNumber: index + 1 }));
  }

  const numbers = Array.from(new Set(subjects.map(getSemesterNumber))).filter(Boolean).sort((a, b) => a - b);
  return numbers.length ? numbers.map((semesterNumber) => ({ semesterNumber })) : [{ semesterNumber: 1 }];
};

const Subjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [activeSemester, setActiveSemester] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("semester");
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [deletingSubject, setDeletingSubject] = useState(null);

  const roles = user?.roles || [];
  const canManage = roles.includes("superAdmin") || roles.includes("schoolAdmin");
  const isSchoolAdmin = roles.includes("schoolAdmin");
  const isFaculty = roles.includes("faculty") || roles.includes("coordinator");
  const isStudent = roles.includes("student");
  const ownSchoolId = getId(user?.schoolId);
  const primaryAssignment = getPrimaryAssignment(user);
  const assignedProgramId = getId(primaryAssignment?.programId);
  const assignedSpecializationId = getId(primaryAssignment?.specializationId);

  const selectedProgram = useMemo(
    () => programs.find((program) => getId(program) === selectedProgramId),
    [programs, selectedProgramId],
  );

  const loadPrograms = useCallback(async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        sortBy: "name",
        order: "asc",
        ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
      };
      const response = await getPrograms(params);
      const apiPrograms = getList(response);
      const scopedPrograms = assignedProgramId
        ? apiPrograms.filter((program) => getId(program) === assignedProgramId)
        : apiPrograms;

      setPrograms(scopedPrograms);
      if (assignedProgramId) {
        setSelectedProgramId(assignedProgramId);
      }
    } catch {
      setPrograms([]);
      if (assignedProgramId) setSelectedProgramId(assignedProgramId);
    }
  }, [assignedProgramId, isSchoolAdmin, ownSchoolId]);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: 1,
        limit: 500,
        sortBy: "code",
        order: "asc",
        ...(selectedProgramId ? { programId: selectedProgramId } : {}),
        ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
        ...(isStudent && assignedSpecializationId ? { specializationId: assignedSpecializationId } : {}),
        ...(isFaculty && user?._id ? { facultyId: user._id } : {}),
      };

      const response = await getSubjects(params);
      setSubjects(getList(response));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load subjects"));
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [assignedSpecializationId, isFaculty, isSchoolAdmin, isStudent, ownSchoolId, selectedProgramId, user?._id]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const semesters = useMemo(
    () => buildSemesters(selectedProgram, subjects, programs),
    [programs, selectedProgram, subjects],
  );

  useEffect(() => {
    if (!semesters.some((semester) => semester.semesterNumber === activeSemester)) {
      setActiveSemester(semesters[0]?.semesterNumber || 1);
    }
  }, [activeSemester, semesters]);

  const semesterCounts = useMemo(() => {
    const counts = new Map();
    subjects.forEach((subject) => {
      const semesterNumber = getSemesterNumber(subject);
      counts.set(semesterNumber, (counts.get(semesterNumber) || 0) + 1);
    });
    return counts;
  }, [subjects]);

  const canAddSubject = canManage;

  const visibleSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSemester = activeTab === "all" || getSemesterNumber(subject) === activeSemester;
      const matchesSearch = !query || [subject.code, subject.name, subject.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
      return matchesSemester && matchesSearch;
    });
  }, [activeSemester, activeTab, search, subjects]);

  const handleDelete = async () => {
    if (!deletingSubject) return;
    setModalLoading(true);
    setModalError("");

    try {
      await deleteSubject(deletingSubject._id);
      setDeletingSubject(null);
      await loadSubjects();
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to deactivate subject"));
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>My Subjects</span>
              <span>/</span>
              <span className="text-[var(--university-ink)]">Semester {activeSemester}</span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
                <BookOpenCheck size={23} />
              </span>
              <div>
                <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)]">My Subjects</h1>
                <p className="mt-1 max-w-2xl text-sm font-medium text-[var(--text-secondary)]">
                  View subjects you are enrolled in or manage under the selected program.
                </p>
              </div>
            </div>
          </div>

          <SubjectProgramSelector
            programs={programs}
            selectedProgramId={selectedProgramId}
            locked={Boolean(assignedProgramId)}
            onChange={(value) => {
              setSelectedProgramId(value);
              setActiveSemester(1);
            }}
          />
        </header>

        <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
          <div className="flex gap-6 border-b border-[var(--border-light)]">
            {[
              ["semester", "By Semester"],
              ["all", "All Subjects"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`border-b-2 px-1 pb-3 text-xs font-bold transition ${
                  activeTab === value
                    ? "border-[var(--stratex-blue)] text-[var(--stratex-blue)]"
                    : "border-transparent text-[var(--university-muted)] hover:text-[var(--university-ink)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "semester" ? (
            <div className="pt-4">
              <SubjectSemesterTabs
                activeSemester={activeSemester}
                counts={semesterCounts}
                onChange={setActiveSemester}
                semesters={semesters}
              />
            </div>
          ) : null}

          <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-[var(--university-ink)]">
                    {activeTab === "semester" ? `Semester ${activeSemester} Subjects` : "All Subjects"}
                  </h2>
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700">
                    {visibleSubjects.length} Subjects
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">
                  {selectedProgramId
                    ? "These are the subjects available under the selected program."
                    : `Showing Semester ${activeSemester} subjects across all programs.`}
                </p>
              </div>
              <SubjectToolbar
                canAdd={canAddSubject}
                onAdd={() => navigate("/dashboard/subjects/create")}
                search={search}
                onSearch={setSearch}
              />
            </div>

            {error ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
                {error}
              </div>
            ) : null}

            <SubjectTable
              canManage={canManage}
              loading={loading}
              onDelete={(subject) => {
                setModalError("");
                setDeletingSubject(subject);
              }}
              onView={(subject) => navigate(`/dashboard/subjects/${subject._id}`)}
              subjects={visibleSubjects}
            />

            <div className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] px-4 py-3 text-xs font-semibold leading-5 text-[var(--stratex-blue)]">
              Core subjects are program specific, while common subjects can be shared across programs.
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-[var(--university-muted)]">Total Subjects</p>
            <p className="mt-1 text-2xl font-black text-[var(--university-ink)]">{subjects.length}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-[var(--university-muted)]">Active Subjects</p>
            <p className="mt-1 text-2xl font-black text-[var(--success)]">{subjects.filter((subject) => subject.status === "active").length}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-[var(--university-muted)]">Selected Program</p>
            <p className="mt-1 truncate text-sm font-black text-[var(--university-ink)]">{selectedProgram?.name || "All Programs"}</p>
          </div>
        </div>
      </div>

      <DeleteSubjectModal
        error={modalError}
        loading={modalLoading}
        onClose={() => setDeletingSubject(null)}
        onDelete={handleDelete}
        subject={deletingSubject}
      />
    </div>
  );
};

export default Subjects;
