import { ArchiveX, CheckCircle2, Circle, Edit3, Eye, FileText, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { audienceLabel, noticeCategoryLabel, NoticeStatusBadge } from "./NoticeBadges";
import { getNoticeText } from "../noticeContentUtils";

const formatDate = (date) => {
  if (!date) return "--";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ReadBadge = ({ isRead }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black uppercase ${isRead ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
    {isRead ? <CheckCircle2 size={11} /> : <Circle size={10} />}
    {isRead ? "Read" : "Unread"}
  </span>
);

const NoticeActions = ({ canManage, notice, onClear, onDelete, onEdit, onView }) => {
  const [open, setOpen] = useState(false);
  const canManageNotice = Boolean((notice.canManage ?? canManage) && !notice.isSample);
  const canClearNotice = Boolean(onClear && !notice.isSample && notice.canClear !== false);
  const canOpenMenu = canManageNotice || canClearNotice;

  return (
    <div className="relative flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onView(notice)}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--stratex-blue)_28%,white)] bg-blue-50 px-3 text-xs font-black text-[var(--stratex-blue)] transition hover:border-[var(--stratex-blue)] hover:bg-[var(--stratex-blue)] hover:text-white"
        title="View notice"
      >
        <Eye size={14} />
        View
      </button>
      {canOpenMenu ? (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--university-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--university-ink)]"
          title="Notice actions"
        >
          <MoreVertical size={16} />
        </button>
      ) : null}
      {open ? (
        <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg border border-[var(--border-light)] bg-white py-1 text-xs font-bold shadow-xl">
          {canManageNotice ? (
            <>
              <button type="button" onClick={() => { setOpen(false); onEdit(notice); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[var(--university-ink)] hover:bg-[var(--surface-soft)]">
                <Edit3 size={13} />
                Edit
              </button>
              <button type="button" onClick={() => { setOpen(false); onDelete(notice); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[var(--error)] hover:bg-red-50">
                <Trash2 size={13} />
                Delete
              </button>
            </>
          ) : null}
          {canClearNotice ? (
            <button type="button" onClick={() => { setOpen(false); onClear(notice); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[var(--university-muted)] hover:bg-[var(--surface-soft)]">
              <ArchiveX size={13} />
              Clear from my view
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const NoticeList = ({ canManage, loading, notices, onClear, onDelete, onEdit, onView }) => (
  <section className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
    <div className="hidden lg:block">
      <table className="min-w-full table-fixed text-left">
        <thead className="border-b border-[var(--border-light)] bg-[color-mix(in_srgb,var(--stratex-blue)_4%,white)] text-[11px] font-black uppercase text-[var(--university-muted)]">
          <tr>
            <th className="w-[48%] px-5 py-4">Notice</th>
            <th className="w-[16%] px-5 py-4">Audience</th>
            <th className="w-[12%] px-5 py-4">Status</th>
            <th className="w-[18%] px-5 py-4">Published On</th>
            <th className="w-[56px] px-5 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td colSpan={5} className="px-5 py-5">
                  <div className="h-12 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
                </td>
              </tr>
            ))
          ) : notices.length ? (
            notices.map((notice) => (
              <tr key={notice._id || notice.id} className="text-xs font-semibold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]">
                <td className="px-5 py-5">
                  <p className="line-clamp-1 text-sm font-black">{notice.title}</p>
                  <p className="mt-1 text-[11px] font-black uppercase text-[var(--stratex-blue)]">{noticeCategoryLabel(notice.category)}</p>
                  <p className="mt-2 line-clamp-2 max-w-2xl text-xs font-medium leading-5 text-[var(--university-muted)]">{getNoticeText(notice.content)}</p>
                  {notice.attachment?.url ? (
                    <a href={notice.attachment.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--stratex-blue)]">
                      <FileText size={13} />
                      View supporting file
                    </a>
                  ) : null}
                </td>
                <td className="px-5 py-5">{audienceLabel(notice.audience)}</td>
                <td className="px-5 py-5">
                  <div className="flex flex-col items-start gap-2">
                    <NoticeStatusBadge status={notice.status} />
                    <ReadBadge isRead={notice.isRead} />
                  </div>
                </td>
                <td className="px-5 py-5">{formatDate(notice.publishedAt || notice.createdAt)}</td>
                <td className="px-5 py-5">
                  <NoticeActions canManage={canManage} notice={notice} onClear={onClear} onDelete={onDelete} onEdit={onEdit} onView={onView} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">No notices found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="grid gap-3 p-4 lg:hidden">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        ))
      ) : notices.length ? (
        notices.map((notice) => (
          <article key={notice._id || notice.id} className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-black text-[var(--university-ink)]">{notice.title}</h3>
                <p className="mt-1 text-xs font-bold text-[var(--university-muted)]">{audienceLabel(notice.audience)}</p>
                <p className="mt-1 text-[11px] font-black uppercase text-[var(--stratex-blue)]">{noticeCategoryLabel(notice.category)}</p>
              </div>
              <NoticeActions canManage={canManage} notice={notice} onClear={onClear} onDelete={onDelete} onEdit={onEdit} onView={onView} />
            </div>
            <p className="mt-3 line-clamp-3 text-xs font-medium leading-5 text-[var(--university-muted)]">{getNoticeText(notice.content)}</p>
            {notice.attachment?.url ? (
              <a href={notice.attachment.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--stratex-blue)]">
                <FileText size={13} />
                View supporting file
              </a>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <NoticeStatusBadge status={notice.status} />
                <ReadBadge isRead={notice.isRead} />
              </div>
              <span className="text-[11px] font-bold text-[var(--university-muted)]">{formatDate(notice.publishedAt || notice.createdAt)}</span>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-10 text-center text-sm font-semibold text-[var(--university-muted)]">No notices found.</div>
      )}
    </div>
  </section>
);

export default NoticeList;
