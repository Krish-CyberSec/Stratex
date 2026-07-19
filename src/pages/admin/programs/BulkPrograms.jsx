import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkUploadForm from "../../../components/dashboard/BulkUploadForm";
import { uploadProgramsCsv } from "../../../services/programService";
import { getSchools } from "../../../services/schoolService";

const BulkPrograms = () => {
  const navigate = useNavigate();

  const validationSchema = {
    requiredHeaders: ["name", "duration", "degreeType"],
    fields: {
      name: { required: true },
      code: { required: false },
      schoolId: { required: false, format: "objectId", allowAlternative: true },
      schoolSlug: { required: false },
      duration: { required: true, type: "number", min: 1 },
      degreeType: { required: true, enum: ["UG", "PG", "Diploma", "PhD"] },
      status: { required: false, enum: ["active", "inactive"] },
    },
    crossChecks: [
      { fn: (row) => (!row.schoolid && !row.schoolslug ? "schoolId or schoolSlug is required" : null) },
    ],
  };

  const downloadReferences = async () => {
    // produce CSV rows: header + rows of [id,slug,name]
    const rows = [["id", "slug", "name"]];
    try {
      const response = await getSchools({ page: 1, limit: 1000, sortBy: "name", order: "asc" });
      const list = response.data?.data || [];
      list.forEach((s) => rows.push([s._id || s.id, s.slug || "", s.name || ""]));
    } catch (err) {
      // ignore — return only header
    }
    return rows;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--university-muted)]">
              Bulk Program Import
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">Upload program CSV</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
              Create multiple programs at once by uploading a prepared CSV template. All records will be validated and imported automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/programs")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft size={16} />
            Back to Programs
          </button>
        </div>

        <BulkUploadForm
          title="Program bulk import"
          subtitle="Programs"
          templateFileName="programs-import-template.csv"
          templateHeaders={[
            "name",
            "code",
            "schoolId",
            "schoolSlug",
            "description",
            "duration",
            "degreeType",
            "status",
          ]}
          helpText="You may provide either schoolId or schoolSlug. The supported degree types are UG, PG, Diploma, and PhD. Leave status blank for active."
          onUpload={uploadProgramsCsv}
          validationSchema={validationSchema}
          onDownloadReferences={downloadReferences}
        />
      </div>
    </div>
  );
};

export default BulkPrograms;
