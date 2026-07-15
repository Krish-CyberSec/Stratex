import { AlertCircle, BookOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramById, updateProgram } from "../../../services/programService";
import { getSchools } from "../../../services/schoolService";
import { getSubjects } from "../../../services/subjectService";
import ProgramDetailHeader from "./components/detail/ProgramDetailHeader";
import ProgramDetailTabs from "./components/detail/ProgramDetailTabs";
import ProgramInlineEditor from "./components/detail/ProgramInlineEditor";
import ProgramMetaGrid from "./components/detail/ProgramMetaGrid";
import ProgramOverviewSide from "./components/detail/ProgramOverviewSide";
import ProgramSemesterStrip from "./components/detail/ProgramSemesterStrip";
import ProgramSubjectTable from "./components/detail/ProgramSubjectTable";
import {
  buildSemesterCards,
  getSemesterNumber,
} from "./components/detail/programDetailUtils";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getPayload = (response) => response.data?.data || response.data?.program || response.data || null;
const getList = (response) => response.data?.data || [];
const getEntityId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const buildEditForm = (program) => ({
  name: program?.name || "",
  code: program?.code || "",
  codeMode: program?.code ? "manual" : "auto",
  schoolId: getEntityId(program?.schoolId),
  degreeType: program?.degreeType || "UG",
  duration: program?.duration || 1,
  status: program?.status || "active",
  description: program?.description || "",
});

const ProgramDetailsPanel = ({ program, selectedSemester, subjects }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--stratex-blue)]">
        <BookOpen size={19} />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-[var(--university-ink)]">About This Program</h2>
        <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
          {program.description || "No description has been added for this program yet."}
        </p>
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg bg-[var(--surface-soft)] p-4">
        <p className="text-xs font-bold text-[var(--university-muted)]">Selected Semester</p>
        <p className="mt-1 text-2xl font-black text-[var(--university-ink)]">{selectedSemester}</p>
      </div>
      <div className="rounded-lg bg-[var(--surface-soft)] p-4">
        <p className="text-xs font-bold text-[var(--university-muted)]">Subjects In View</p>
        <p className="mt-1 text-2xl font-black text-[var(--university-ink)]">{subjects.length}</p>
      </div>
      <div className="rounded-lg bg-[var(--surface-soft)] p-4">
        <p className="text-xs font-bold text-[var(--university-muted)]">Total Semesters</p>
        <p className="mt-1 text-2xl font-black text-[var(--university-ink)]">{Number(program.duration || 0) * 2}</p>
      </div>
    </div>
  </section>
);

const ProgramPlaceholderPanel = ({ title }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white px-5 py-14 text-center shadow-sm">
    <h2 className="text-base font-bold text-[var(--university-ink)]">{title}</h2>
    <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-[var(--university-muted)]">
      This section is ready for backend data and can be expanded when the related module is finalized.
    </p>
  </section>
);

const ProgramView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [activeTab, setActiveTab] = useState("Semesters");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectPage, setSubjectPage] = useState(1);
  const [subjectPageSize, setSubjectPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(buildEditForm(null));

  const loadProgram = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProgramById(id);
      const nextProgram = getPayload(response);
      setProgram(nextProgram);
      setEditForm(buildEditForm(nextProgram));
      setSelectedSemester(1);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load program"));
      setProgram(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadSubjects = useCallback(async () => {
    setSubjectsLoading(true);

    try {
      const response = await getSubjects({
        programId: id,
        page: 1,
        limit: 200,
        sortBy: "code",
        order: "asc",
      });
      setSubjects(getList(response));
    } catch {
      setSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  }, [id]);

  const loadSchools = useCallback(async () => {
    try {
      const response = await getSchools({ page: 1, limit: 100, sortBy: "name", order: "asc" });
      setSchools(getList(response));
    } catch {
      setSchools([]);
    }
  }, []);

  useEffect(() => {
    loadProgram();
    loadSubjects();
    loadSchools();
  }, [loadProgram, loadSchools, loadSubjects]);

  const semesters = useMemo(() => buildSemesterCards(program?.duration), [program?.duration]);

  const subjectCounts = useMemo(() => {
    const counts = new Map();
    subjects.forEach((subject) => {
      const semesterNumber = getSemesterNumber(subject);
      if (!semesterNumber) return;
      counts.set(semesterNumber, (counts.get(semesterNumber) || 0) + 1);
    });
    return counts;
  }, [subjects]);

  const visibleSubjects = useMemo(() => {
    const query = subjectSearch.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSemester = getSemesterNumber(subject) === selectedSemester;
      if (!matchesSemester) return false;
      if (!query) return true;
      return [subject.code, subject.name, subject.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [selectedSemester, subjectSearch, subjects]);

  useEffect(() => {
    setSubjectPage(1);
  }, [selectedSemester, subjectSearch]);

  useEffect(() => {
    const totalPages = Math.max(Math.ceil(visibleSubjects.length / subjectPageSize), 1);
    if (subjectPage > totalPages) {
      setSubjectPage(totalPages);
    }
  }, [subjectPage, subjectPageSize, visibleSubjects.length]);

  const paginatedSubjects = useMemo(() => {
    const start = (subjectPage - 1) * subjectPageSize;
    return visibleSubjects.slice(start, start + subjectPageSize);
  }, [subjectPage, subjectPageSize, visibleSubjects]);

  const editSchools = useMemo(() => {
    if (schools.length) return schools;
    return program?.schoolId ? [program.schoolId] : [];
  }, [program, schools]);

  const canSave = useMemo(
    () => editForm.name.trim().length >= 2 && editForm.schoolId && Number(editForm.duration) >= 1 && !saving,
    [editForm.duration, editForm.name, editForm.schoolId, saving],
  );

  const handleStartEdit = () => {
    setEditError("");
    setEditForm(buildEditForm(program));
    setIsEditing(true);
    setActiveTab("Program Details");
  };

  const handleCancelEdit = () => {
    setEditError("");
    setEditForm(buildEditForm(program));
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!canSave) return;
    setSaving(true);
    setEditError("");

    try {
      await updateProgram(id, {
        name: editForm.name.trim(),
        code: editForm.codeMode === "manual" ? editForm.code.trim() : "",
        schoolId: editForm.schoolId,
        degreeType: editForm.degreeType,
        duration: Number(editForm.duration),
        status: editForm.status,
        description: editForm.description.trim(),
      });
      setIsEditing(false);
      await Promise.all([loadProgram(), loadSubjects()]);
    } catch (err) {
      setEditError(getErrorMessage(err, "Unable to update program"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1480px] space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="h-28 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="h-96 animate-pulse rounded-xl bg-white shadow-sm" />
            <div className="h-96 animate-pulse rounded-xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[900px] rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto text-[var(--error)]" size={34} />
          <h1 className="mt-3 text-xl font-bold text-[var(--university-ink)]">Program not available</h1>
          <p className="mt-2 text-sm font-medium text-[var(--university-muted)]">{error || "Unable to load this program."}</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/programs")}
            className="mt-5 rounded-lg bg-[var(--stratex-blue)] px-4 py-2 text-sm font-bold text-white"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <ProgramDetailHeader
          canSave={canSave}
          isEditing={isEditing}
          onBack={() => navigate("/dashboard/programs")}
          onCancel={handleCancelEdit}
          onEdit={handleStartEdit}
          onSave={handleSaveEdit}
          program={program}
          saving={saving}
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-4">
            {isEditing ? (
              <ProgramInlineEditor
                error={editError}
                form={editForm}
                onChange={setEditForm}
                schools={editSchools}
              />
            ) : (
              <ProgramMetaGrid program={program} />
            )}
            <ProgramDetailTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "Program Details" ? (
              <ProgramDetailsPanel program={program} selectedSemester={selectedSemester} subjects={visibleSubjects} />
            ) : null}

            {activeTab === "Semesters" ? (
              <>
                <ProgramSemesterStrip
                  onSelect={setSelectedSemester}
                  selectedSemester={selectedSemester}
                  semesters={semesters}
                  subjectCounts={subjectCounts}
                />
                <ProgramSubjectTable
                  loading={subjectsLoading}
                  onPageChange={setSubjectPage}
                  onPageSizeChange={(value) => {
                    setSubjectPageSize(value);
                    setSubjectPage(1);
                  }}
                  onSearch={setSubjectSearch}
                  page={subjectPage}
                  pageSize={subjectPageSize}
                  search={subjectSearch}
                  selectedSemester={selectedSemester}
                  subjects={paginatedSubjects}
                  totalSubjects={visibleSubjects.length}
                />
              </>
            ) : null}

            {activeTab === "Subjects Overview" ? (
              <ProgramSubjectTable
                loading={subjectsLoading}
                onPageChange={setSubjectPage}
                onPageSizeChange={(value) => {
                  setSubjectPageSize(value);
                  setSubjectPage(1);
                }}
                onSearch={setSubjectSearch}
                page={subjectPage}
                pageSize={subjectPageSize}
                search={subjectSearch}
                selectedSemester={selectedSemester}
                subjects={paginatedSubjects}
                totalSubjects={visibleSubjects.length}
              />
            ) : null}

            {activeTab === "Program Analytics" ? (
              <ProgramPlaceholderPanel title="Program Analytics" />
            ) : null}
          </main>

          <ProgramOverviewSide program={program} subjects={subjects} semesters={semesters} />
        </div>
      </div>
    </div>
  );
};

export default ProgramView;
