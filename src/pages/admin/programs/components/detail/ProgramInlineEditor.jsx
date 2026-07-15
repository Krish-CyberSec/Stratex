const fieldClass =
  "h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_12%,white)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)]";

const labelClass = "mb-2 block text-xs font-bold text-[var(--university-ink)]";

const ProgramInlineEditor = ({ error, form, onChange, schools }) => {
  const update = (field, value) => onChange((current) => ({ ...current, [field]: value }));

  return (
    <section className="rounded-xl border border-[color-mix(in_srgb,var(--stratex-blue)_24%,white)] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-[var(--university-ink)]">Edit Program Details</h2>
        <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">
          Update the details here and save from the top action bar.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className={labelClass}>Program Name *</span>
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className={fieldClass}
            placeholder="Enter program name"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[var(--university-ink)]">Program Code</span>
            <span className="grid grid-cols-2 rounded-lg border border-[var(--border)] bg-white p-1 text-xs font-bold">
              {["auto", "manual"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => update("codeMode", mode)}
                  className={`rounded-md px-3 py-1.5 capitalize transition ${
                    form.codeMode === mode
                      ? "bg-[var(--stratex-blue)] text-white shadow-sm"
                      : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </span>
          </div>
          <input
            disabled={form.codeMode === "auto"}
            value={form.code}
            onChange={(event) => update("code", event.target.value.toUpperCase())}
            className={fieldClass}
            placeholder={form.codeMode === "auto" ? "Auto-generated after save" : "e.g. CSE-UG"}
          />
          <span className="mt-1.5 block text-xs font-medium text-[var(--university-muted)]">
            {form.codeMode === "auto"
              ? "Backend will generate a unique school-scoped code."
              : "Manual codes are normalized and checked for duplicates."}
          </span>
        </label>

        <label className="block">
          <span className={labelClass}>School *</span>
          <select value={form.schoolId} onChange={(event) => update("schoolId", event.target.value)} className={fieldClass}>
            <option value="">Select school</option>
            {schools.map((school) => (
              <option key={school._id || school.id} value={school._id || school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Degree Type *</span>
          <select value={form.degreeType} onChange={(event) => update("degreeType", event.target.value)} className={fieldClass}>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="Diploma">Diploma</option>
            <option value="PhD">PhD</option>
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Duration (Years) *</span>
          <input
            type="number"
            min="1"
            value={form.duration}
            onChange={(event) => update("duration", event.target.value)}
            className={fieldClass}
          />
          <span className="mt-1.5 block text-xs font-medium text-[var(--university-muted)]">
            Semesters generated: {Number(form.duration || 0) * 2}
          </span>
        </label>

        <label className="block">
          <span className={labelClass}>Status</span>
          <select value={form.status} onChange={(event) => update("status", event.target.value)} className={fieldClass}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className={labelClass}>Description</span>
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className="min-h-28 w-full resize-y rounded-lg border border-[var(--border)] bg-white px-3 py-3 text-sm font-medium text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
            placeholder="Add a short description of the program"
          />
        </label>
      </div>
    </section>
  );
};

export default ProgramInlineEditor;
