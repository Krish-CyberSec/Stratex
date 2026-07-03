import { useMemo, useState } from "react";
import { ImagePlus, Save } from "lucide-react";

const initialState = {
  name: "",
  slug: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  code: "",
  vision: "",
  mission: "",
  departmentCount: "",
  logoUrl: "",
  bannerUrl: "",
  status: "active",
  logo: null,
  banner: null,
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const SchoolForm = ({
  school,
  mode = "create",
  loading = false,
  error = "",
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState(() => ({
    ...initialState,
    name: school?.name || "",
    slug: school?.slug || "",
    description: school?.description || "",
    email: school?.email || "",
    phone: school?.phone || "",
    website: school?.website || "",
    code: school?.code || "",
    vision: school?.vision || "",
    mission: school?.mission || "",
    departmentCount: school?.departmentCount || "",
    logoUrl: school?.logo || "",
    bannerUrl: school?.banner || "",
    status: school?.status || "active",
  }));

  const isCreate = mode === "create";

  const canSubmit = useMemo(
    () => form.name.trim().length >= 3 && form.slug.trim().length >= 2 && !loading,
    [form.name, form.slug, loading],
  );

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" && isCreate && !prev.slug
        ? { slug: slugify(value) }
        : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug),
      description: form.description.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      code: form.code.trim(),
      vision: form.vision.trim(),
      mission: form.mission.trim(),
      departmentCount: form.departmentCount ? Number(form.departmentCount) : 0,
      status: form.status,
    };

    if (!isCreate) {
      payload.logo = form.logoUrl.trim() || null;
      payload.banner = form.bannerUrl.trim() || null;
    }

    if (isCreate) {
      const body = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          body.append(key, value);
        }
      });

      if (form.logo) body.append("logo", form.logo);
      if (form.banner) body.append("banner", form.banner);

      onSubmit(body);
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-[var(--error)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            School name
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="School of Engineering"
            className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
            required
            minLength={3}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Slug
          </span>
          <input
            type="text"
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="school-of-engineering"
            className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
            required
            minLength={2}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
          Description
        </span>
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Add a short overview for this school"
          rows={4}
          className="w-full resize-none rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["email", "Email", "cse@university.edu", "email"],
          ["phone", "Phone", "+1 (123) 456-7890", "text"],
          ["website", "Website", "www.cse.university.edu", "text"],
          ["code", "School Code", "CSE01", "text"],
          ["departmentCount", "Departments", "3", "number"],
        ].map(([field, label, placeholder, type]) => (
          <label key={field} className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
              {label}
            </span>
            <input
              type={type}
              value={form[field]}
              onChange={(event) => updateField(field, event.target.value)}
              placeholder={placeholder}
              min={
                type === "number"
                  ? 0
                  : undefined
              }
              className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Vision
          </span>
          <textarea
            value={form.vision}
            onChange={(event) => updateField("vision", event.target.value)}
            placeholder="Add the school's vision"
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
            Mission
          </span>
          <textarea
            value={form.mission}
            onChange={(event) => updateField("mission", event.target.value)}
            placeholder="Add the school's mission"
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
          Status
        </span>
        <select
          value={form.status}
          onChange={(event) => updateField("status", event.target.value)}
          className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      {isCreate ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["logo", "Logo"],
            ["banner", "Banner"],
          ].map(([field, label]) => (
            <label
              key={field}
              className="flex min-h-28 cursor-pointer flex-col justify-center rounded-xl border border-dashed border-[var(--university-border)] bg-[var(--university-surface-soft)] px-4 py-4 transition hover:border-[var(--university-blue)]"
            >
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--university-ink)]">
                <ImagePlus size={17} />
                {label}
              </span>
              <span className="text-xs leading-5 text-[var(--university-muted)]">
                {form[field]?.name || "Optional image, max 5MB"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => updateField(field, event.target.files?.[0] || null)}
              />
            </label>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["logoUrl", "Logo URL", school?.logo],
            ["bannerUrl", "Banner URL", school?.banner],
          ].map(([field, label, preview]) => (
            <label
              key={field}
              className="grid gap-3 rounded-xl border border-[var(--university-border)] bg-[var(--university-surface-soft)] p-4 sm:grid-cols-[88px_1fr] sm:items-center"
            >
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
                {form[field] || preview ? (
                  <img
                    src={form[field] || preview}
                    alt={label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--university-muted)]">
                    <ImagePlus size={20} />
                  </div>
                )}
              </div>

              <span className="block min-w-0">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--university-muted)]">
                  {label}
                </span>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-[var(--university-border)] bg-white px-4 py-3 text-sm text-[var(--university-ink)] outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,white)]"
                />
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-[var(--university-border)] pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[var(--university-border)] px-4 py-2.5 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
          >
            Cancel
          </button>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--university-blue)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--university-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Saving..." : isCreate ? "Create School" : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default SchoolForm;
