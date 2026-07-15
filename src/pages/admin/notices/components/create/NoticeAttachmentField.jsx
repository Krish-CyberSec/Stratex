import { FileText, UploadCloud, X } from "lucide-react";

const NoticeAttachmentField = ({ file, onChange }) => (
  <div>
    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Attachment <span className="font-semibold text-[var(--university-muted)]">(Optional)</span></span>
    <label className="flex min-h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white px-4 py-5 text-center transition hover:border-[var(--stratex-blue)] hover:bg-blue-50">
      <input
        type="file"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <div className="flex flex-col items-center gap-1">
        <UploadCloud size={24} className="text-[var(--stratex-blue)]" />
        <span className="text-sm font-black text-[var(--university-ink)]">
          {file?.name || "Drag & drop your file here"}
        </span>
        <span className="text-xs font-semibold text-[var(--university-muted)]">or browse file</span>
        <span className="mt-1 text-[11px] font-semibold text-[var(--university-muted)]">Supports: PDF, DOCX, PNG, JPG (Max. 10MB)</span>
      </div>
    </label>
    {file ? (
      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)] px-3 py-2">
        <span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-[var(--university-ink)]">
          <FileText size={14} className="shrink-0 text-[var(--stratex-blue)]" />
          <span className="truncate">{file.name}</span>
        </span>
        <button type="button" onClick={() => onChange(null)} className="shrink-0 text-[var(--university-muted)] hover:text-[var(--error)]">
          <X size={15} />
        </button>
      </div>
    ) : null}
  </div>
);

export default NoticeAttachmentField;
