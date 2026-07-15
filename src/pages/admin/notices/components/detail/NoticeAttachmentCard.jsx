import { Download, ExternalLink, FileText, Maximize2, Printer } from "lucide-react";
import { formatFileSize, isPdf } from "./noticeDetailUtils";

const NoticeAttachmentCard = ({ attachment }) => {
  if (!attachment?.url) return null;

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 border-b border-[var(--border-light)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FileText size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-[var(--university-ink)]">{attachment.name || "Supporting file"}</h3>
            <p className="mt-1 text-xs font-bold text-[var(--university-muted)]">{attachment.fileType || "File"} • {formatFileSize(attachment.size)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={attachment.url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]">
            <Maximize2 size={14} />
            Full Screen
          </a>
          <a href={attachment.url} download className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]">
            <Download size={14} />
            Download
          </a>
          <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]">
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      {isPdf(attachment) ? (
        <iframe
          title={attachment.name || "Notice attachment"}
          src={attachment.url}
          className="mt-4 h-[420px] w-full rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)]"
        />
      ) : (
        <div className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)] p-6 text-center">
          <FileText size={34} className="text-[var(--stratex-blue)]" />
          <p className="mt-3 text-sm font-black text-[var(--university-ink)]">Preview unavailable for this file type</p>
          <a href={attachment.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[var(--stratex-blue)]">
            Open supporting file
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </section>
  );
};

export default NoticeAttachmentCard;
