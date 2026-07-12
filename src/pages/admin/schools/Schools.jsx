import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import {
  getSchools,
} from "../../../services/schoolService";
import { getPrograms } from "../../../services/programService";
import { getUsers } from "../../../services/userService";
import SchoolCard from "./components/SchoolCard";
import SchoolLogo from "./components/SchoolLogo";
import SchoolPagination from "./components/SchoolPagination";
import SchoolStatCard from "./components/SchoolStatCard";
import SchoolToolbar from "./components/SchoolToolbar";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const sampleSchools = [
  {
    _id: "sample-computer-science",
    name: "School of Computer Science",
    slug: "school-of-computer-science",
    description: "Focuses on computing, software engineering, algorithms and modern technologies.",
    status: "active",
    programCount: 12,
    facultyCount: 45,
    isSample: true,
  },
  {
    _id: "sample-ai",
    name: "School of Artificial Intelligence",
    slug: "school-of-artificial-intelligence",
    description: "Dedicated to AI, ML, data science, neural networks and intelligent systems.",
    status: "active",
    programCount: 8,
    facultyCount: 32,
    isSample: true,
  },
  {
    _id: "sample-cyber-security",
    name: "School of Cyber Security",
    slug: "school-of-cyber-security",
    description: "Building experts in cyber security, ethical hacking and digital forensics.",
    status: "active",
    programCount: 6,
    facultyCount: 25,
    isSample: true,
  },
  {
    _id: "sample-applied-sciences",
    name: "School of Applied Sciences",
    slug: "school-of-applied-sciences",
    description: "Mathematics, physics, chemistry and interdisciplinary applied learning.",
    status: "inactive",
    programCount: 5,
    facultyCount: 18,
    isSample: true,
  },
];

const initialFilters = {
  search: "",
  status: "",
  sortBy: "name",
  order: "asc",
  page: 1,
  limit: 8,
};

const getId = (item) => item?._id || item?.id;

const Schools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [stats, setStats] = useState({
    total: 0,
    programs: 0,
    active: 0,
    inactive: 0,
  });
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");

  const loadSchools = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const listParams = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search.trim() || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
      };

      const [schoolResponse, allResponse, activeResponse, inactiveResponse, programResponse] =
        await Promise.all([
          getSchools(listParams),
          getSchools({ page: 1, limit: 1 }),
          getSchools({ page: 1, limit: 1, status: "active" }),
          getSchools({ page: 1, limit: 1, status: "inactive" }),
          getPrograms({ page: 1, limit: 1 }),
        ]);

      const apiSchools = schoolResponse.data?.data || [];
      const schoolsWithCounts = await Promise.all(
        apiSchools.map(async (school) => {
          try {
            const [programsResponse, facultyResponse] = await Promise.all([
              getPrograms({ page: 1, limit: 1, schoolId: getId(school) }),
              getUsers({
                page: 1,
                limit: 1,
                schoolId: getId(school),
                role: "faculty",
              }),
            ]);

            return {
              ...school,
              programCount: programsResponse.data?.pagination?.total ?? 0,
              facultyCount: facultyResponse.data?.pagination?.total ?? 0,
            };
          } catch {
            return {
              ...school,
              programCount: school.programCount ?? 0,
              facultyCount: school.facultyCount ?? 0,
            };
          }
        }),
      );

      setSchools(schoolsWithCounts);
      setPagination(schoolResponse.data?.pagination || null);
      setStats({
        total: allResponse.data?.pagination?.total ?? schoolsWithCounts.length,
        active: activeResponse.data?.pagination?.total ?? 0,
        inactive: inactiveResponse.data?.pagination?.total ?? 0,
        programs: programResponse.data?.pagination?.total ?? 0,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load schools"));
      setSchools([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = window.setTimeout(loadSchools, 250);
    return () => window.clearTimeout(timer);
  }, [loadSchools]);

  useEffect(() => {
    if (!location.state?.message) return;

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  const visibleSchools = useMemo(
    () => (!loading && !error && schools.length === 0 ? sampleSchools : schools),
    [error, loading, schools],
  );

  const showingSamples = !loading && !error && schools.length === 0;

  const updateFilter = (key, value) => {
    setFilters((current) => {
      if (key === "sort") {
        return {
          ...current,
          sortBy: value.sortBy,
          order: value.order,
          page: 1,
        };
      }

      return {
        ...current,
        [key]: value,
        page: key === "page" ? value : 1,
      };
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_48%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
              Schools
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
              Manage all schools under the School of Engineering & Technology.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/schools/bulk")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-hover)]"
            >
              Bulk Upload
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/schools/create")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
            >
              <Plus size={17} />
              Add School
            </button>
          </div>
        </header>

        <SchoolStatCard {...stats} />

        {notice ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[color-mix(in_srgb,var(--success)_24%,white)] bg-[color-mix(in_srgb,var(--success)_10%,white)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-xs uppercase tracking-[0.08em]"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <SchoolToolbar
          filters={filters}
          loading={loading}
          viewMode={viewMode}
          onChange={updateFilter}
          onRefresh={loadSchools}
          onViewModeChange={setViewMode}
        />

        {showingSamples ? (
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--info)_20%,white)] bg-[color-mix(in_srgb,var(--info)_7%,white)] px-4 py-3 text-sm font-semibold text-[var(--university-blue-dark)]">
            No backend schools found yet. Showing sample cards so you can preview the layout.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-[var(--error)]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: filters.limit }).map((_, index) => (
              <div
                key={index}
                className="min-h-[232px] animate-pulse rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm"
              >
                <div className="h-12 w-12 rounded-2xl bg-[var(--surface-hover)]" />
                <div className="mt-5 h-4 w-3/4 rounded bg-[var(--surface-hover)]" />
                <div className="mt-3 h-3 w-full rounded bg-[var(--surface-hover)]" />
                <div className="mt-2 h-3 w-5/6 rounded bg-[var(--surface-hover)]" />
              </div>
            ))}
          </div>
        ) : visibleSchools.length ? (
          <section
            className={
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                : "grid gap-3"
            }
          >
            {visibleSchools.map((school) =>
              viewMode === "grid" ? (
                <SchoolCard
                  key={getId(school)}
                  school={school}
                  onView={(item) => !item.isSample && navigate(`/dashboard/schools/${getId(item)}`)}
                />
              ) : (
                <article
                  key={getId(school)}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <SchoolLogo logo={school.logo} name={school.name} />
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[var(--university-ink)]">
                        {school.name}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-xs font-medium text-[var(--university-muted)]">
                        {school.description || "No description added."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-bold text-[var(--university-muted)]">
                      {school.programCount ?? 0} Programs
                    </span>
                    <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-bold text-[var(--university-muted)]">
                      {school.facultyCount ?? 0} Faculty
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        !school.isSample && navigate(`/dashboard/schools/${getId(school)}`)
                      }
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
                    >
                      View School
                    </button>
                  </div>
                </article>
              ),
            )}
          </section>
        ) : (
          <div className="rounded-2xl border border-[var(--border-light)] bg-white px-5 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)]">
              <Building2 size={22} />
            </div>
            <p className="text-sm font-bold text-[var(--university-ink)]">No schools found</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--university-muted)]">
              Adjust the filters or create a school to start adding programs.
            </p>
          </div>
        )}

        {!showingSamples && !loading && !error ? (
          <SchoolPagination
            pagination={pagination}
            pageSize={filters.limit}
            onPageChange={(nextPage) => updateFilter("page", nextPage)}
            onPageSizeChange={(limit) =>
              setFilters((current) => ({ ...current, limit, page: 1 }))
            }
          />
        ) : null}
      </div>
    </div>
  );
};

export default Schools;
