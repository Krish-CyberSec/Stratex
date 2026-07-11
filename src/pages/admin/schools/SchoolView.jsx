import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSchool, getSchoolById } from "../../../services/schoolService";
import { getPrograms } from "../../../services/programService";
import { getUsers } from "../../../services/userService";
import DeleteSchoolModal from "./components/DeleteSchoolModal";
import SchoolAboutCard from "./components/detail/SchoolAboutCard";
import SchoolDetailHeader from "./components/detail/SchoolDetailHeader";
import SchoolDetailTabs from "./components/detail/SchoolDetailTabs";
import SchoolHeroBanner from "./components/detail/SchoolHeroBanner";
import SchoolInfoCard from "./components/detail/SchoolInfoCard";
import SchoolQuickLinks from "./components/detail/SchoolQuickLinks";
import SchoolRelatedGrid from "./components/detail/SchoolRelatedGrid";
import SchoolVisionMission from "./components/detail/SchoolVisionMission";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getPayload = (response) => response.data?.data || response.data?.school || response.data;

const SchoolView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [counts, setCounts] = useState({
    programs: 0,
    faculty: 0,
    students: 0,
    coordinators: 0,
  });
  const [related, setRelated] = useState({
    programs: [],
    faculty: [],
    students: [],
    coordinators: [],
  });
  const [schoolAdmin, setSchoolAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSchool, setDeletingSchool] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadSchool = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        schoolResponse,
        programsResponse,
        facultyResponse,
        studentsResponse,
        coordinatorsResponse,
        headResponse,
      ] = await Promise.all([
        getSchoolById(id),
        getPrograms({ page: 1, limit: 50, schoolId: id, sortBy: "name", order: "asc" }),
        getUsers({ page: 1, limit: 50, schoolId: id, role: "faculty", sortBy: "firstName", order: "asc" }),
        getUsers({ page: 1, limit: 50, schoolId: id, role: "student", sortBy: "firstName", order: "asc" }),
        getUsers({ page: 1, limit: 50, schoolId: id, role: "coordinator", sortBy: "firstName", order: "asc" }),
        getUsers({ page: 1, limit: 1, schoolId: id, role: "schoolAdmin" }),
      ]);

      const schoolPayload = getPayload(schoolResponse);
      setSchool(schoolPayload);
      setCounts({
        programs: programsResponse.data?.pagination?.total ?? 0,
        faculty: facultyResponse.data?.pagination?.total ?? 0,
        students: studentsResponse.data?.pagination?.total ?? 0,
        coordinators: coordinatorsResponse.data?.pagination?.total ?? 0,
      });
      setRelated({
        programs: programsResponse.data?.data || [],
        faculty: facultyResponse.data?.data || [],
        students: studentsResponse.data?.data || [],
        coordinators: coordinatorsResponse.data?.data || [],
      });
      setSchoolAdmin(headResponse.data?.data?.[0] || null);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load school details"));
      setSchool(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSchool();
  }, [loadSchool]);

  const handleDelete = async () => {
    if (!deletingSchool) return;

    setModalLoading(true);
    setModalError("");

    try {
      await deleteSchool(deletingSchool._id);
      navigate("/dashboard/schools", {
        state: { message: "School deleted successfully" },
      });
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to delete school"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleQuickNavigate = (target) => {
    setActiveTab(target);
  };

  const renderTabContent = () => {
    if (activeTab === "programs") {
      return (
        <SchoolRelatedGrid
          items={related.programs}
          title="Programs"
          type="programs"
        />
      );
    }

    if (activeTab === "faculty") {
      return (
        <SchoolRelatedGrid
          items={related.faculty}
          title="Faculty"
          type="faculty"
        />
      );
    }

    if (activeTab === "students") {
      return (
        <SchoolRelatedGrid
          items={related.students}
          title="Students"
          type="students"
        />
      );
    }

    if (activeTab === "coordinators") {
      return (
        <SchoolRelatedGrid
          items={related.coordinators}
          title="Coordinators"
          type="coordinators"
        />
      );
    }

    return (
      <>
        <SchoolHeroBanner school={school} />

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-5">
            <SchoolAboutCard counts={counts} school={school} />
            <SchoolVisionMission school={school} />
          </div>

          <div className="space-y-5">
            <SchoolInfoCard school={school} schoolAdmin={schoolAdmin} />
            <SchoolQuickLinks onNavigate={handleQuickNavigate} />
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_48%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-20 animate-pulse rounded-xl bg-white" />
          <div className="h-12 animate-pulse rounded-xl bg-white" />
          <div className="h-52 animate-pulse rounded-xl bg-white" />
          <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <div className="h-72 animate-pulse rounded-xl bg-white" />
            <div className="h-72 animate-pulse rounded-xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_48%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <Building2 className="mx-auto text-[var(--error)]" size={28} />
          <p className="mt-3 text-sm font-bold text-[var(--error)]">
            {error || "School not found"}
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/schools")}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-[var(--university-ink)]"
          >
            Back to Schools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_48%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-7xl space-y-5">
        <SchoolDetailHeader
          school={school}
          onDelete={() => {
            setModalError("");
            setDeletingSchool(school);
          }}
          onEdit={() => {
            navigate(`/dashboard/schools/${id}/edit`);
          }}
        />

        <SchoolDetailTabs activeTab={activeTab} counts={counts} onChange={setActiveTab} />

        {renderTabContent()}

        <button
          type="button"
          onClick={() => navigate("/dashboard/schools")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
        >
          <ArrowLeft size={16} />
          Back to Schools
        </button>
      </div>

      <DeleteSchoolModal
        school={deletingSchool}
        loading={modalLoading}
        error={modalError}
        onClose={() => setDeletingSchool(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SchoolView;
