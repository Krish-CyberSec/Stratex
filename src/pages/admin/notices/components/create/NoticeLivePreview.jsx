import { Eye, Paperclip } from "lucide-react";
import { audienceLabel, NoticeStatusBadge } from "../NoticeBadges";

const formatPreviewDate = (date) => {
  const parsed = date ? new Date(date) : new Date();
  if (Number.isNaN(parsed.getTime())) return "Publish date";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NoticeLivePreview = ({ form }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-2 text-[var(--stratex-blue)]">
      <Eye size={16} />
      <h2 className="text-sm font-black">Live Preview</h2>
    </div>

    <article className="rounded-xl border border-[var(--border-light)] bg-white p-4">
      <NoticeStatusBadge status={form.status} />
      <h3 className="mt-4 break-words text-lg font-black text-[var(--university-ink)]">
        {form.title || "Notice Title"}
      </h3>
      <p className="mt-1 text-xs font-bold text-[var(--university-muted)]">{formatPreviewDate(form.publishedAt)}</p>
      <div className="my-4 h-px bg-[var(--border-light)]" />
      <p className="min-h-16 whitespace-pre-line text-sm font-medium leading-6 text-[var(--university-muted)]">
        {form.content || "Notice content will appear here..."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-ink)]">
        <span>Audience:</span>
        <span className="rounded-md bg-blue-50 px-2 py-1 text-[var(--stratex-blue)]">{audienceLabel(form.audience)}</span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
        <Paperclip size={14} />
        {form.attachment?.name || "No attachment"}
      </div>
    </article>
  </section>
);

export default NoticeLivePreview;
