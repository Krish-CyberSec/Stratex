const ProgramCreateField = ({
  as = "input",
  className = "",
  help,
  label,
  required = false,
  ...props
}) => {
  const Control = as;

  return (
    <label className={`block min-w-0 ${className}`}>
      {label ? (
        <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">
          {label} {required ? <span className="text-[var(--error)]">*</span> : null}
        </span>
      ) : null}
      <Control
        {...props}
        className={`w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-medium text-[var(--university-ink)] outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--stratex-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--stratex-blue)_12%,white)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--university-muted)] ${
          as === "textarea" ? "min-h-28 resize-y py-3" : "h-11"
        }`}
      />
      {help ? (
        <span className="mt-2 block text-xs font-medium leading-5 text-[var(--university-muted)]">
          {help}
        </span>
      ) : null}
    </label>
  );
};

export default ProgramCreateField;
