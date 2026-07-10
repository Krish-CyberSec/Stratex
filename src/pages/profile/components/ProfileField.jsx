const ProfileField = ({
  as = "input",
  label,
  required = false,
  className = "",
  ...props
}) => {
  const Control = as;

  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-2 block text-sm font-bold text-[var(--university-ink)]">
        {label} {required ? <span className="text-[var(--error)]">*</span> : null}
      </span>
      <Control
        {...props}
        className={`w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_14%,white)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)] ${
          as === "textarea" ? "min-h-28 resize-y" : "h-12"
        }`}
      />
    </label>
  );
};

export default ProfileField;
