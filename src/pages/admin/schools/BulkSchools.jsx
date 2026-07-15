import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkUploadForm from "../../../components/dashboard/BulkUploadForm";
import { uploadSchoolsCsv, getSchools as fetchSchools } from "../../../services/schoolService";

const BulkSchools = () => {
  const navigate = useNavigate();

  const validationSchema = {
    requiredHeaders: ["name", "slug"],
    fields: {
      name: { required: true },
      slug: { required: true },
      email: { required: false },
      website: { required: false },
      code: { required: false },
      status: { required: false, enum: ["active", "inactive"] },
    },
    crossChecks: [],
  };

  const downloadReferences = async () => {
    const rows = [["id", "slug", "name", "code"]];
    try {
      const response = await fetchSchools({ page: 1, limit: 1000, sortBy: "name", order: "asc" });
      const list = response.data?.data || [];
      list.forEach((s) => rows.push([s._id || s.id, s.slug || "", s.name || "", s.code || ""]));
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
              Bulk School Import
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">Upload school CSV</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
              Create multiple schools in one step. Download the template, fill the required fields, and upload the CSV to import.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/schools")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft size={16} />
            Back to Schools
          </button>
        </div>

        <BulkUploadForm
          title="School bulk import"
          subtitle="Schools"
          templateFileName="schools-import-template.csv"
          templateHeaders={[
            "name",
            "slug",
            "description",
            "email",
            "website",
            "code",
            "vision",
            "mission",
            "status",
          ]}
          sampleRows={[
            [
              "School of Engineering",
              "school-of-engineering",
              "Engineering school with multiple departments.",
              "info@engineering.example.com",
              "https://engineering.example.com",
              "ENG",
              "Build a better future.",
              "Prepare leaders in technology.",
              "active",
            ],
          ]}
          helpText="Slug should only contain lowercase letters, numbers, and hyphens. Leave status blank to default to active. If website is left empty it will be auto-generated using the base URL and slug (pattern: https://baseurl/slug). Configure base URL using the SCHOOL_BASE_URL environment variable."
          onUpload={uploadSchoolsCsv}
          validationSchema={validationSchema}
          onDownloadReferences={downloadReferences}
        />
      </div>
    </div>
  );
};

export default BulkSchools;
