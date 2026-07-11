import { ArrowLeft, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createProgram } from "../../../services/programService";
import { getSchools } from "../../../services/schoolService";
import AcademicBreadcrumb from "../schools/components/create/AcademicBreadcrumb";
import ProgramCreateField from "./components/create/ProgramCreateField";
import ProgramInfoCard from "./components/create/ProgramInfoCard";
import ProgramPreviewCard from "./components/create/ProgramPreviewCard";
import ProgramStatusChoice from "./components/create/ProgramStatusChoice";
import { ProgramCreateCard } from "./components/create/ProgramCreateShell";

const initialForm = {
  name: "",
  code: "",
  codeMode: "auto",
  schoolId: "",
  degreeType: "",
  duration: "",
  description: "",
  status: "active",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getList = (response) => response.data?.data || [];
const getSchoolId = (school) => school?._id || school?.id || "";

const CreateProgram = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");
  const ownSchoolId = typeof user?.schoolId === "object" ? getSchoolId(user.schoolId) : user?.schoolId;

  useEffect(() => {
    let isMounted = true;

    const loadSchools = async () => {
      setLoadingSchools(true);

      try {
        const response = await getSchools({ page: 1, limit: 100, sortBy: "name", order: "asc" });
        const apiSchools = getList(response);
        const ownSchool = typeof user?.schoolId === "object" ? user.schoolId : null;
        const scopedSchools = isSchoolAdmin
          ? apiSchools.filter((school) => getSchoolId(school) === ownSchoolId)
          : apiSchools;
        const nextSchools = scopedSchools.length ? scopedSchools : ownSchool && ownSchoolId ? [ownSchool] : [];

        if (isMounted) {
          setSchools(nextSchools);
          setForm((current) => ({
            ...current,
            schoolId: current.schoolId || nextSchools[0]?._id || nextSchools[0]?.id || "",
          }));
        }
      } catch {
        if (isMounted) setSchools([]);
      } finally {
        if (isMounted) setLoadingSchools(false);
      }
    };

    loadSchools();

    return () => {
      isMounted = false;
    };
  }, [isSchoolAdmin, ownSchoolId, user?.schoolId]);

  const selectedSchool = useMemo(
    () => schools.find((school) => getSchoolId(school) === form.schoolId),
    [form.schoolId, schools],
  );

  const canSubmit = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      form.schoolId &&
      form.degreeType &&
      Number(form.duration) >= 1 &&
      !saving,
    [form.degreeType, form.duration, form.name, form.schoolId, saving],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");

    try {
      await createProgram({
        name: form.name.trim(),
        code: form.codeMode === "manual" ? form.code.trim() : "",
        schoolId: form.schoolId,
        degreeType: form.degreeType,
        duration: Number(form.duration),
        description: form.description.trim(),
        status: form.status,
      });

      navigate("/dashboard/programs", {
        state: { message: "Program created successfully" },
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create program"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1480px] space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <AcademicBreadcrumb items={["Dashboard", "Programs", "Add New Program"]} />
            <div>
              <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)]">
                Add New Program
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
                Create a new academic program under the selected school. Semesters will be generated automatically based on duration.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/programs")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
          >
            <ArrowLeft size={16} />
            Back to Programs
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div className="space-y-5">
            <ProgramCreateCard
              step="1"
              title="Basic Information"
              subtitle="Enter the basic details of the program."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <ProgramCreateField
                  label="Program Name"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter program name"
                  help="e.g. B.Tech Computer Science Engineering"
                />

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--university-ink)]">Program Code</span>
                    <div className="grid grid-cols-2 rounded-lg border border-[var(--border)] bg-white p-1 text-xs font-bold">
                      {["auto", "manual"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => updateField("codeMode", mode)}
                          className={`rounded-md px-3 py-1.5 capitalize transition ${
                            form.codeMode === mode
                              ? "bg-[var(--stratex-blue)] text-white shadow-sm"
                              : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ProgramCreateField
                    aria-label="Program code"
                    value={form.code}
                    disabled={form.codeMode === "auto"}
                    onChange={(event) => updateField("code", event.target.value.toUpperCase())}
                    placeholder={form.codeMode === "auto" ? "Auto-generated after save" : "e.g. CSE-UG"}
                    help={form.codeMode === "auto" ? "Backend will generate a unique school-scoped code." : "Manual codes are normalized and checked for duplicates."}
                  />
                </div>

                <label className="block min-w-0">
                  <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">
                    School <span className="text-[var(--error)]">*</span>
                  </span>
                  <select
                    value={form.schoolId}
                    disabled={isSchoolAdmin || loadingSchools}
                    onChange={(event) => updateField("schoolId", event.target.value)}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_12%,white)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]"
                  >
                    <option value="">{loadingSchools ? "Loading schools..." : "Select school"}</option>
                    {schools.map((school) => (
                      <option key={getSchoolId(school)} value={getSchoolId(school)}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  <span className="mt-2 block text-xs font-medium leading-5 text-[var(--university-muted)]">
                    Select the school offering this program.
                  </span>
                </label>

                <label className="block min-w-0">
                  <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">
                    Degree Type <span className="text-[var(--error)]">*</span>
                  </span>
                  <select
                    value={form.degreeType}
                    onChange={(event) => updateField("degreeType", event.target.value)}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_12%,white)]"
                  >
                    <option value="">Select degree type</option>
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                    <option value="Diploma">Diploma</option>
                    <option value="PhD">PhD</option>
                  </select>
                  <span className="mt-2 block text-xs font-medium leading-5 text-[var(--university-muted)]">
                    Choose the type of degree offered.
                  </span>
                </label>

                <div className="min-w-0">
                  <ProgramCreateField
                    label="Duration (Years)"
                    required
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={(event) => updateField("duration", event.target.value)}
                    placeholder="Enter duration in years"
                    help="Total duration of the program in years."
                  />
                  <div className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--stratex-blue)_28%,white)] bg-[color-mix(in_srgb,var(--stratex-blue)_6%,white)] px-4 py-3 text-xs font-semibold leading-5 text-[var(--stratex-blue)]">
                    Total semesters that will be created: <strong>{Number(form.duration || 0) * 2}</strong>
                    <br />
                    <span>(Duration x 2)</span>
                  </div>
                </div>

                <ProgramCreateField
                  as="textarea"
                  className="md:col-span-2"
                  label="Description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Enter program description"
                  help="Provide a brief description about the program, its objectives, and career opportunities."
                />
              </div>
            </ProgramCreateCard>

            <ProgramCreateCard
              step="2"
              title="Program Status"
              subtitle="Set the initial status of the program."
            >
              <span className="mb-3 block text-xs font-bold text-[var(--university-ink)]">
                Status <span className="text-[var(--error)]">*</span>
              </span>
              <ProgramStatusChoice value={form.status} onChange={(value) => updateField("status", value)} />

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/programs")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={16} />
                  {saving ? "Creating..." : "Create Program"}
                </button>
              </div>
            </ProgramCreateCard>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <ProgramPreviewCard form={form} selectedSchool={selectedSchool} />
            <ProgramInfoCard />
          </aside>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;
