import { CalendarDays, Users } from "lucide-react";
import { audienceLabel, NoticeStatusBadge } from "../NoticeBadges";
import { formatNoticeDate } from "./noticeDetailUtils";
import { hasNoticeHtml, sanitizeNoticeHtml } from "../../noticeContentUtils";

const NoticeContentCard = ({ notice }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6">
    <NoticeStatusBadge status={notice.status} />
    <h2 className="mt-4 break-words text-2xl font-black leading-tight text-[var(--university-ink)]">
      {notice.title}
    </h2>

    <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[var(--border-light)] pb-4 text-xs font-bold text-[var(--university-muted)]">
      <span className="inline-flex items-center gap-2">
        <CalendarDays size={15} className="text-[var(--stratex-blue)]" />
        Published on {formatNoticeDate(notice.publishedAt || notice.createdAt)}
      </span>
      <span className="inline-flex items-center gap-2">
        <Users size={15} className="text-[var(--stratex-blue)]" />
        Audience: <span className="rounded-md bg-blue-50 px-2 py-1 text-[var(--stratex-blue)]">{audienceLabel(notice.audience)}</span>
      </span>
    </div>

    {hasNoticeHtml(notice.content) ? (
      <div
        className="notice-rich-content mt-5 text-sm font-medium leading-7 text-[var(--university-ink)]"
        dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }}
      />
    ) : (
      <div className="mt-5 whitespace-pre-line text-sm font-medium leading-7 text-[var(--university-ink)]">
        {notice.content}
      </div>
    )}
  </section>
);

export default NoticeContentCard;
