import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, GraduationCap } from "lucide-react";
import { getPrograms } from "../../../../../services/programService";
import { getSchools } from "../../../../../services/schoolService";
import { getSemesters } from "../../../../../services/semesterService";
import { getSpecializations } from "../../../../../services/specializationService";

const audienceOptions = [
  { label: "All", value: "all" },
  { label: "Super Admin", value: "superAdmin" },
  { label: "School Admin", value: "schoolAdmin" },
  { label: "Faculty", value: "faculty" },
  { label: "Coordinator", value: "coordinator" },
  { label: "Student", value: "student" },
  { label: "Exam Cell", value: "examCell" },
];

const getId = (item) => item?._id || item?.id || "";
const getList = (response) => response.data?.data || [];
const unique = (values) => [...new Set(values.filter(Boolean))];

const buildCriteria = ({ audience, schoolId, programId, specializationId, semesterId, year }) => {
  if (audience.includes("all")) {
    return { allUsers: true };
  }

  const criteria = {
    allUsers: false,
    roles: audience,
  };

  if (audience.includes("student")) {
    criteria.roles = unique([...(criteria.roles || []).filter((role) => role !== "all")]);
    if (schoolId) criteria.schoolIds = [schoolId];
    if (programId) criteria.programIds = [programId];
    if (specializationId) criteria.specializationIds = [specializationId];
    if (semesterId) criteria.semesterIds = [semesterId];
    if (!specializationId && programId) criteria.includeUsersWithoutSpecialization = true;
    if (year) criteria.metadata = { studentYear: year };
  }

  return criteria;
};

const NoticeAudienceSelector = ({ audience, audienceCriteria, onChange, onCriteriaChange }) => {
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [studentFilters, setStudentFilters] = useState({
    schoolId: audienceCriteria?.schoolIds?.[0] || "",
    programId: audienceCriteria?.programIds?.[0] || "",
    year: audienceCriteria?.metadata?.studentYear || "",
    semesterId: audienceCriteria?.semesterIds?.[0] || "",
    specializationId: audienceCriteria?.specializationIds?.[0] || "",
  });

  const selectedProgram = useMemo(
    () => programs.find((program) => getId(program) === studentFilters.programId),
    [programs, studentFilters.programId],
  );

  const availablePrograms = useMemo(() => {
    if (!studentFilters.schoolId) return programs;
    return programs.filter((program) => getId(program.schoolId) === studentFilters.schoolId);
  }, [programs, studentFilters.schoolId]);

  const yearOptions = useMemo(() => {
    const duration = Number(selectedProgram?.duration || 0);
    const maxYearFromSemesters = Math.max(
      ...semesters.map((semester) => Math.ceil(Number(semester.semesterNumber || 0) / 2)),
      0,
    );
    const totalYears = Math.max(duration, maxYearFromSemesters, 0);
    return Array.from({ length: totalYears }, (_, index) => index + 1);
  }, [selectedProgram?.duration, semesters]);

  const availableSemesters = useMemo(() => {
    if (!studentFilters.year) return semesters;
    const yearNumber = Number(studentFilters.year);
    return semesters.filter((semester) => {
      const semesterNumber = Number(semester.semesterNumber || 0);
      return semesterNumber === yearNumber * 2 - 1 || semesterNumber === yearNumber * 2;
    });
  }, [semesters, studentFilters.year]);

  const syncCriteria = useCallback(
    (nextAudience, nextFilters = studentFilters) => {
      const criteria = buildCriteria({
        audience: nextAudience,
        schoolId: nextFilters.schoolId,
        programId: nextFilters.programId,
        specializationId: nextFilters.specializationId,
        semesterId: nextFilters.semesterId,
        year: nextFilters.year,
      });

      if (nextFilters.year && !nextFilters.semesterId) {
        criteria.semesterIds = availableSemesters.map(getId).filter(Boolean);
      }

      if (JSON.stringify(criteria) !== JSON.stringify(audienceCriteria || {})) {
        onCriteriaChange(criteria);
      }
    },
    [audienceCriteria, availableSemesters, onCriteriaChange, studentFilters],
  );

  const toggle = (value) => {
    if (value === "all") {
      onChange(["all"]);
      onCriteriaChange({ allUsers: true });
      return;
    }

    const withoutAll = audience.filter((item) => item !== "all");
    const next = withoutAll.includes(value)
      ? withoutAll.filter((item) => item !== value)
      : [...withoutAll, value];
    const normalized = next.length ? next : ["all"];

    onChange(normalized);
    syncCriteria(normalized);
  };

  const updateStudentFilter = (field, value) => {
    const nextFilters = {
      ...studentFilters,
      [field]: value,
      ...(field === "schoolId" ? { programId: "", year: "", semesterId: "", specializationId: "" } : {}),
      ...(field === "programId" ? { year: "", semesterId: "", specializationId: "" } : {}),
      ...(field === "year" ? { semesterId: "" } : {}),
    };

    setStudentFilters(nextFilters);
    syncCriteria(audience, nextFilters);
  };

  useEffect(() => {
    const loadBaseOptions = async () => {
      try {
        const [schoolResponse, programResponse] = await Promise.all([
          getSchools({ page: 1, limit: 100, sortBy: "name", order: "asc" }),
          getPrograms({ page: 1, limit: 200, sortBy: "name", order: "asc" }),
        ]);
        setSchools(getList(schoolResponse));
        setPrograms(getList(programResponse));
      } catch {
        setSchools([]);
        setPrograms([]);
      }
    };

    loadBaseOptions();
  }, []);

  useEffect(() => {
    const loadProgramOptions = async () => {
      if (!studentFilters.programId) {
        setSemesters([]);
        setSpecializations([]);
        return;
      }

      try {
        const [semesterResponse, specializationResponse] = await Promise.all([
          getSemesters({ page: 1, limit: 50, programId: studentFilters.programId, sortBy: "semesterNumber", order: "asc" }),
          getSpecializations({ page: 1, limit: 100, programId: studentFilters.programId, sortBy: "name", order: "asc" }),
        ]);
        setSemesters(getList(semesterResponse));
        setSpecializations(getList(specializationResponse));
      } catch {
        setSemesters([]);
        setSpecializations([]);
      }
    };

    loadProgramOptions();
  }, [studentFilters.programId]);

  useEffect(() => {
    if (!audience.includes("student") || !studentFilters.year || studentFilters.semesterId) return;
    syncCriteria(audience);
  }, [audience, availableSemesters, studentFilters.semesterId, studentFilters.year, syncCriteria]);

  const studentSelected = audience.includes("student") && !audience.includes("all");

  return (
    <div>
      <span className="mb-3 block text-xs font-black text-[var(--university-ink)]">Audience <span className="text-[var(--error)]">*</span></span>
      <div className="flex flex-wrap gap-2">
        {audienceOptions.map((option) => {
          const active = audience.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`h-10 rounded-lg border px-4 text-xs font-black transition ${
                active
                  ? "border-[var(--stratex-blue)] bg-blue-50 text-[var(--stratex-blue)]"
                  : "border-[var(--border-light)] bg-white text-[var(--university-ink)] hover:border-[var(--stratex-blue)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {studentSelected ? (
        <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--stratex-blue)]">
              <GraduationCap size={18} />
            </span>
            <div>
              <h3 className="text-sm font-black text-[var(--university-ink)]">Student Targeting</h3>
              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--university-muted)]">
                Leave filters empty to include all students, or narrow by school, course, year, semester, and specialization.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">School</span>
              <select value={studentFilters.schoolId} onChange={(event) => updateStudentFilter("schoolId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option key={getId(school)} value={getId(school)}>{school.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Course / Program</span>
              <select value={studentFilters.programId} onChange={(event) => updateStudentFilter("programId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="">All Courses</option>
                {availablePrograms.map((program) => (
                  <option key={getId(program)} value={getId(program)}>{program.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Academic Year</span>
              <select disabled={!studentFilters.programId} value={studentFilters.year} onChange={(event) => updateStudentFilter("year", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]">
                <option value="">All Years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Semester</span>
              <select disabled={!studentFilters.programId} value={studentFilters.semesterId} onChange={(event) => updateStudentFilter("semesterId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]">
                <option value="">All Semesters</option>
                {availableSemesters.map((semester) => (
                  <option key={getId(semester)} value={getId(semester)}>
                    Semester {semester.semesterNumber || semester.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Specialization</span>
              <select disabled={!studentFilters.programId} value={studentFilters.specializationId} onChange={(event) => updateStudentFilter("specializationId", event.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]">
                <option value="">All / Core</option>
                {specializations.map((specialization) => (
                  <option key={getId(specialization)} value={getId(specialization)}>{specialization.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-white px-3 py-3 text-xs font-bold leading-5 text-[var(--university-muted)]">
            <Filter size={14} className="mt-0.5 shrink-0 text-[var(--stratex-blue)]" />
            These filters are combined. For example, selecting a course and Year 2 targets students in Semester 3 and Semester 4 of that course.
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NoticeAudienceSelector;
export { audienceOptions };
