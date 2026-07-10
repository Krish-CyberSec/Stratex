import { UploadCloud } from "lucide-react";

const AcademicUploadField = ({
  accept = "image/*",
  file,
  help,
  label,
  onChange,
  previewUrl = "",
  required,
}) => {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-bold text-[var(--university-ink)]">
        {label} {required ? <span className="text-[var(--error)]">*</span> : null}
      </span>
      <span className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[linear-gradient(180deg,#ffffff,var(--surface-soft))] px-4 py-4 text-center transition hover:border-[var(--stratex-blue)] hover:bg-[color-mix(in_srgb,var(--stratex-blue)_4%,white)]">
        <span className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
          {previewUrl ? (
            <img src={previewUrl} alt={`${label} preview`} className="h-full w-full object-cover" />
          ) : (
            <UploadCloud size={21} />
          )}
        </span>
        <span className="text-sm font-semibold text-[var(--university-ink)]">
          {file?.name || `Click to upload ${label.toLowerCase()}`}
        </span>
        <span className="mt-1 text-xs font-medium text-[var(--university-muted)]">{help}</span>
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </span>
    </label>
  );
};

export default AcademicUploadField;
