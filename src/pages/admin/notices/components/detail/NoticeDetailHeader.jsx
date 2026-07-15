import { ArrowLeft, Download, Edit3, Printer } from "lucide-react";

const NoticeDetailHeader = ({ notice, onBack, onEdit }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
        <span>Dashboard</span>
        <span>/</span>
        <span>Notices</span>
        <span>/</span>
        <span className="line-clamp-1 text-[var(--university-ink)]">{notice?.title || "Notice Details"}</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          title="Back to notices"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black leading-tight text-[var(--university-ink)]">Notice Details</h1>
        </div>
      </div>
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
      >
        <Edit3 size={15} />
        Edit Notice
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
      >
        <Printer size={15} />
        Print
      </button>
      {notice?.attachment?.url ? (
        <a
          href={notice.attachment.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
        >
          <Download size={15} />
          Download
        </a>
      ) : null}
    </div>
  </header>
);

export default NoticeDetailHeader;
