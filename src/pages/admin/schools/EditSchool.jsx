import { ArrowLeft, Building2, Save, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSchoolById, updateSchool } from "../../../services/schoolService";
import AcademicBreadcrumb from "./components/create/AcademicBreadcrumb";
import AcademicFormCard from "./components/create/AcademicFormCard";
import AcademicTextField from "./components/create/AcademicTextField";
import AcademicUploadField from "./components/create/AcademicUploadField";
import SchoolEditPreview from "./components/create/SchoolEditPreview";
import SchoolGuidelinesCard from "./components/create/SchoolGuidelinesCard";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getPayload = (response) => response.data?.data || response.data?.school || response.data;

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const UNIVERSITY_BASE_URL = (import.meta.env.VITE_UNIVERSITY_BASE_URL || "").replace(/\/+$/, "");

const getGeneratedWebsite = (slug) => {
  if (!UNIVERSITY_BASE_URL) return "";
  return `${UNIVERSITY_BASE_URL}/${slugify(slug) || "school-slug"}/`;
};

const getInitialForm = (school = {}) => ({
  name: school.name || "",
  slug: school.slug || "",
  description: school.description || "",
  logo: school.logo || "",
  banner: school.banner || "",
  logoFile: null,
  bannerFile: null,
  status: school.status || "active",
  code: school.code || "",
  email: school.email || "",
  website: school.website || "",
  vision: school.vision || "",
  mission: school.mission || "",
});

const useObjectUrl = (file) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url;
};

const EditSchool = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [form, setForm] = useState(getInitialForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSchool = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSchoolById(id);
      const schoolPayload = getPayload(response);
      setSchool(schoolPayload);
      setForm(getInitialForm(schoolPayload));
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

  const generatedWebsite = getGeneratedWebsite(form.slug);
  const logoObjectUrl = useObjectUrl(form.logoFile);
  const bannerObjectUrl = useObjectUrl(form.bannerFile);
  const logoPreview = logoObjectUrl || form.logo;
  const bannerPreview = bannerObjectUrl || form.banner;

  const canSubmit = useMemo(
    () =>
      form.name.trim().length >= 3 &&
      form.slug.trim().length >= 2 &&
      form.description.trim().length >= 8 &&
      !saving,
    [form.description, form.name, form.slug, saving],
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("slug", slugify(form.slug));
    payload.append("description", form.description.trim());
    payload.append("status", form.status);
    payload.append("code", form.code.trim());
    payload.append("email", form.email.trim());
    payload.append("website", generatedWebsite || form.website.trim());
    payload.append("vision", form.vision.trim());
    payload.append("mission", form.mission.trim());

    if (form.logoFile) payload.append("logo", form.logoFile);
    if (form.bannerFile) payload.append("banner", form.bannerFile);

    try {
      await updateSchool(id, payload);
      navigate(`/dashboard/schools/${id}`, {
        state: { message: "School updated successfully" },
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update school"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-20 animate-pulse rounded-2xl bg-white" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
            <div className="h-[620px] animate-pulse rounded-2xl bg-white" />
            <div className="h-[420px] animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!school && error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <Building2 className="mx-auto text-[var(--error)]" size={28} />
          <p className="mt-3 text-sm font-bold text-[var(--error)]">{error}</p>
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
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#eef5ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <form id="edit-school-form" onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
        <AcademicBreadcrumb items={["Dashboard", "Schools", school?.name || "School", "Edit School"]} />

        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/schools/${id}`)}
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
              title="Back to school"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
                Edit School
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
                Update the details of the school under the School of Engineering & Technology.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save School"}
          </button>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
          <AcademicFormCard
            icon={<Building2 size={22} />}
            title="School Information"
            description="Update the basic details of the school."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <AcademicTextField
                label="School Name"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Enter school name"
                help="This will be displayed as the school name."
              />
              <AcademicTextField
                label="Slug"
                required
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="school-of-computer-science"
                help="URL friendly unique slug."
              />

              <AcademicTextField
                as="textarea"
                className="md:col-span-2"
                label="Description"
                required
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Enter a brief description about the school..."
                help="Describe the school, its vision, focus areas and objectives."
              />

              <AcademicUploadField
                label="School Logo"
                file={form.logoFile}
                previewUrl={logoPreview}
                help="PNG, JPG or SVG. Upload a new file to update the current logo."
                onChange={(file) => updateField("logoFile", file)}
              />
              <AcademicUploadField
                label="School Banner"
                file={form.bannerFile}
                previewUrl={bannerPreview}
                help="JPG or PNG. Upload a new wide banner to update it."
                onChange={(file) => updateField("bannerFile", file)}
              />

              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-bold text-[var(--university-ink)]">
                  Status <span className="text-[var(--error)]">*</span>
                </span>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-white px-4 text-sm font-semibold capitalize text-[var(--university-ink)] outline-none focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_14%,white)]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span className="mt-2 block text-xs font-medium leading-5 text-[var(--university-muted)]">
                  Select current status of the school.
                </span>
              </label>

              <AcademicTextField
                label="School Code"
                value={form.code}
                onChange={(event) => updateField("code", event.target.value)}
                placeholder="CSE01"
                help="Short internal code for this school."
              />

              <AcademicTextField
                label="School Email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Enter email address"
                help="Official contact email for this school."
              />

              <label className="block min-w-0 md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[var(--university-ink)]">
                  Generated Website
                </span>
                <span className="flex min-h-12 items-center break-all rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm font-semibold text-[var(--university-muted)]">
                  {generatedWebsite || form.website || "Set VITE_UNIVERSITY_BASE_URL in frontend .env"}
                </span>
                <span className="mt-2 block text-xs font-medium leading-5 text-[var(--university-muted)]">
                  Website is generated automatically from the school slug.
                </span>
              </label>

              <AcademicTextField
                as="textarea"
                label="Vision"
                value={form.vision}
                onChange={(event) => updateField("vision", event.target.value)}
                placeholder="Enter the school vision..."
                help="Optional vision statement."
              />

              <AcademicTextField
                as="textarea"
                label="Mission"
                value={form.mission}
                onChange={(event) => updateField("mission", event.target.value)}
                placeholder="Enter the school mission..."
                help="Optional mission statement."
              />
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/schools/${id}`)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--stratex-blue)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save School"}
              </button>
            </div>
          </AcademicFormCard>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <SchoolEditPreview form={{ ...form, logo: logoPreview, banner: bannerPreview }} />
            <SchoolGuidelinesCard note="You can edit all details of the school here." />
          </aside>
        </div>
      </form>
    </div>
  );
};

export default EditSchool;
