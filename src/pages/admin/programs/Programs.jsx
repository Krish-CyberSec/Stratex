import { CheckCircle2, GraduationCap, Hourglass, Landmark, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { deleteProgram, getPrograms } from "../../../services/programService";
import { getSchools } from "../../../services/schoolService";
import DeleteProgramModal from "./components/DeleteProgramModal";
import ProgramFilters from "./components/ProgramFilters";
import ProgramPagination from "./components/ProgramPagination";
import ProgramStatCard from "./components/ProgramStatCard";
import ProgramTable from "./components/ProgramTable";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getList = (response) => response.data?.data || [];
const getPagination = (response) => response.data?.pagination || {};

const getSchoolId = (school) => school?._id || school?.id || "";

const Programs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    schools: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    schoolId: "",
    degreeType: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deletingProgram, setDeletingProgram] = useState(null);

  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");
  const ownSchoolId = typeof user?.schoolId === "object" ? getSchoolId(user.schoolId) : user?.schoolId;

  const availableSchools = useMemo(() => {
    if (!isSchoolAdmin) return schools;
    const ownSchool = typeof user?.schoolId === "object" ? user.schoolId : null;
    const matchedSchools = schools.filter((school) => getSchoolId(school) === ownSchoolId);
    if (matchedSchools.length) return matchedSchools;
    return ownSchool && ownSchoolId ? [ownSchool] : [];
  }, [isSchoolAdmin, ownSchoolId, schools, user?.schoolId]);

  const loadSchools = useCallback(async () => {
    try {
      const response = await getSchools({ page: 1, limit: 100, sortBy: "name", order: "asc" });
      setSchools(getList(response));
      setStats((current) => ({
        ...current,
        schools: isSchoolAdmin ? 1 : response.data?.pagination?.total ?? getList(response).length,
      }));
    } catch {
      setSchools([]);
    }
  }, [isSchoolAdmin]);

  const loadStats = useCallback(async () => {
    const baseParams = isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {};

    try {
      const [totalResponse, activeResponse, inactiveResponse] = await Promise.all([
        getPrograms({ ...baseParams, page: 1, limit: 1 }),
        getPrograms({ ...baseParams, page: 1, limit: 1, status: "active" }),
        getPrograms({ ...baseParams, page: 1, limit: 1, status: "inactive" }),
      ]);

      setStats((current) => ({
        ...current,
        total: totalResponse.data?.pagination?.total ?? 0,
        active: activeResponse.data?.pagination?.total ?? 0,
        inactive: inactiveResponse.data?.pagination?.total ?? 0,
      }));
    } catch {
      setStats((current) => ({ ...current, total: 0, active: 0, inactive: 0 }));
    }
  }, [isSchoolAdmin, ownSchoolId]);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    const params = {
      page,
      limit,
      sortBy: "createdAt",
      order: "desc",
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.degreeType ? { degreeType: filters.degreeType } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.schoolId ? { schoolId: filters.schoolId } : {}),
      ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
    };

    try {
      const response = await getPrograms(params);
      const apiPrograms = getList(response);
      setPrograms(apiPrograms);
      setPagination(getPagination(response));
    } catch {
      setPrograms([]);
      setPagination({ total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [filters.degreeType, filters.schoolId, filters.search, filters.status, isSchoolAdmin, limit, ownSchoolId, page]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  };

  const refreshData = async () => {
    await Promise.all([loadPrograms(), loadStats(), loadSchools()]);
  };

  const handleDelete = async () => {
    if (!deletingProgram) return;
    setModalLoading(true);
    setModalError("");

    try {
      await deleteProgram(deletingProgram._id);
      setDeletingProgram(null);
      await refreshData();
    } catch (error) {
      setModalError(getErrorMessage(error, "Unable to delete program"));
    } finally {
      setModalLoading(false);
    }
  };

  const openView = (program) => {
    navigate(`/dashboard/programs/${program._id}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
              <GraduationCap size={23} />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)]">Programs</h1>
              <p className="mt-1 max-w-2xl text-sm font-medium text-[var(--text-secondary)]">
                Manage all academic programs offered by different schools.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/programs/create")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
          >
            <Plus size={17} />
            Add New Program
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ProgramStatCard icon={GraduationCap} label="Total Programs" sublabel="Across all schools" value={stats.total} tone="blue" />
          <ProgramStatCard icon={CheckCircle2} label="Active Programs" sublabel="Currently running" value={stats.active} tone="green" />
          <ProgramStatCard icon={Hourglass} label="Inactive Programs" sublabel="Not active" value={stats.inactive} tone="amber" />
          <ProgramStatCard icon={Landmark} label="Total Schools" sublabel="Offering programs" value={stats.schools} tone="purple" />
        </div>

        <ProgramFilters
          degreeType={filters.degreeType}
          onDegreeTypeChange={(value) => updateFilter("degreeType", value)}
          onSchoolChange={(value) => updateFilter("schoolId", value)}
          onSearchChange={(value) => updateFilter("search", value)}
          onStatusChange={(value) => updateFilter("status", value)}
          schoolId={isSchoolAdmin ? ownSchoolId || "" : filters.schoolId}
          schools={availableSchools}
          search={filters.search}
          status={filters.status}
        />

        <div className="overflow-hidden rounded-xl shadow-sm">
          <ProgramTable
            loading={loading}
            programs={programs}
            onDelete={(program) => {
              setModalError("");
              setDeletingProgram(program);
            }}
            onView={openView}
          />
          <ProgramPagination
            limit={limit}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            onPageChange={(value) => setPage(Math.min(Math.max(value, 1), pagination.totalPages || 1))}
            page={page}
            total={pagination.total || programs.length}
            totalPages={pagination.totalPages || 1}
          />
        </div>
      </div>

      <DeleteProgramModal
        error={modalError}
        loading={modalLoading}
        onClose={() => setDeletingProgram(null)}
        onDelete={handleDelete}
        program={deletingProgram}
      />
    </div>
  );
};

export default Programs;
