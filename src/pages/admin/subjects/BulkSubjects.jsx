import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkUploadForm from "../../../components/dashboard/BulkUploadForm";
import { uploadSubjectsCsv } from "../../../services/subjectService";
import { getPrograms } from "../../../services/programService";
import { getSchools } from "../../../services/schoolService";

const BulkSubjects = () => {
  const navigate = useNavigate();

  const validationSchema = {
    requiredHeaders: ["code", "name"],
    fields: {
      code: { required: true },
      name: { required: true },
      schoolId: { required: false, format: "objectId", allowAlternative: true },
      schoolSlug: { required: false },
      programId: { required: false, format: "objectId", allowAlternative: true },
      programCode: { required: false },
      semesterId: { required: false, format: "objectId", allowAlternative: true },
      semesterNumber: { required: false, type: "number", min: 1 },
      credits: { required: false, type: "number", min: 0 },
      status: { required: false, enum: ["active", "inactive"] },
    },
    crossChecks: [
      { fn: (row) => (!row.schoolid && !row.schoolslug ? "schoolId or schoolSlug is required" : null) },
      { fn: (row) => (!row.programid && !row.programcode ? "programId or programCode is required" : null) },
      { fn: (row) => (!row.semesterid && !row.semesternumber ? "semesterId or semesterNumber is required" : null) },
    ],
  };

  const downloadReferences = async () => {
    const rows = [["schoolId", "schoolSlug", "schoolName", "programId", "programCode", "programName", "semesterId", "semesterNumber"]];
    try {
      const schoolsResp = await getSchools({ page: 1, limit: 1000, sortBy: "name", order: "asc" });
      const schools = schoolsResp.data?.data || [];
      for (const s of schools) {
        // attempt to fetch programs for each school is expensive; instead fetch all programs once
      }
      const programsResp = await getPrograms({ page: 1, limit: 1000, sortBy: "name", order: "asc" });
      const programs = programsResp.data?.data || [];
      // semesters are not available in simple API, so leave semesterId blank; admin should use program view to find semester ids or use semesterNumber
      schools.forEach((s) => {
        const schoolPrograms = programs.filter((p) => p.schoolId === s._id || (p.schoolId && p.schoolId._id === s._id));
        if (schoolPrograms.length) {
          schoolPrograms.forEach((p) => rows.push([s._id || s.id, s.slug || "", s.name || "", p._id || p.id, p.code || "", p.name || "", "", ""]));
        } else {
          rows.push([s._id || s.id, s.slug || "", s.name || "", "", "", "", "", ""]);
        }
      });
    } catch (err) {
      // ignore
    }
    return rows;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--university-muted)]">
              Bulk Subject Import
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">Upload subject CSV</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
              Import subjects in bulk with flexible mapping for school, program, and semester fields.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/subjects")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft size={16} />
            Back to Subjects
          </button>
        </div>

        <BulkUploadForm
          title="Subject bulk import"
          subtitle="Subjects"
          templateFileName="subjects-import-template.csv"
          templateHeaders={[
            "code",
            "name",
            "description",
            "schoolId",
            "schoolSlug",
            "programId",
            "programCode",
            "semesterId",
            "semesterNumber",
            "credits",
            "specializationId",
            "status",
          ]}
          helpText="Provide either schoolId or schoolSlug, and either programId or programCode. Use semesterId or semesterNumber. Leave status blank to default to active."
          onUpload={uploadSubjectsCsv}
          validationSchema={validationSchema}
          onDownloadReferences={downloadReferences}
        />
      </div>
    </div>
  );
};

export default BulkSubjects;
