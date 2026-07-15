import { ArrowRight, Bell, Download, FileText, List, UserRound } from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";
import { audienceLabel, noticeCategoryLabel, NoticeStatusBadge } from "../NoticeBadges";
import { formatNoticeDate, getPersonName } from "./noticeDetailUtils";

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[96px_1fr] gap-3 text-xs">
    <span className="font-bold text-[var(--university-muted)]">{label}</span>
    <span className="min-w-0 break-words text-right font-black text-[var(--university-ink)]">{value}</span>
  </div>
);

const ActionButton = ({ children, href, icon: Icon }) => {
  const className = "flex w-full items-center justify-between gap-3 rounded-lg py-2 text-left text-xs font-bold text-[var(--university-ink)] transition hover:text-[var(--stratex-blue)]";
  const content = (
    <>
      <span className="inline-flex min-w-0 items-center gap-2">
        <Icon size={15} className="shrink-0 text-[var(--stratex-blue)]" />
        <span className="truncate">{children}</span>
      </span>
      <ArrowRight size={14} className="shrink-0 text-[var(--stratex-blue)]" />
    </>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={className}>{content}</a>;
  }

  return <button type="button" className={className}>{content}</button>;
};

const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const NoticeDetailSidebar = ({ notice, onBack }) => {
  const { user } = useAuth();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes("superAdmin");
  const isSender = getId(notice.createdBy) && getId(notice.createdBy) === getId(user);
  const canViewEngagement = isSuperAdmin || isSender;

  return (
  <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Notice Information</h2>
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-[96px_1fr] gap-3 text-xs">
          <span className="font-bold text-[var(--university-muted)]">Status</span>
          <span className="text-right"><NoticeStatusBadge status={notice.status} /></span>
        </div>
        <InfoRow label="Published At" value={formatNoticeDate(notice.publishedAt || notice.createdAt)} />
        <InfoRow label="Category" value={noticeCategoryLabel(notice.category)} />
        <InfoRow label="Audience" value={audienceLabel(notice.audience)} />
        <InfoRow label="Created By" value={getPersonName(notice.createdBy)} />
        <InfoRow label="Created On" value={formatNoticeDate(notice.createdAt)} />
        <InfoRow label="Last Updated" value={formatNoticeDate(notice.updatedAt)} />
      </div>
    </section>

    {canViewEngagement ? (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Reach & Engagement</h2>
      <div className="mt-4 space-y-3">
        <InfoRow label="Recipients" value="Available in notifications" />
        <InfoRow label="Delivered" value="Tracked per user" />
        <InfoRow label="Read" value="Tracked per user" />
        <InfoRow label="Pending" value="Tracked per user" />
      </div>
      <p className="mt-4 text-[11px] font-bold text-[var(--university-muted)]">Updated just now</p>
    </section>
    ) : null}

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Related Actions</h2>
      <div className="mt-4 space-y-1">
        <button type="button" onClick={onBack} className="flex w-full items-center justify-between gap-3 rounded-lg py-2 text-left text-xs font-bold text-[var(--university-ink)] transition hover:text-[var(--stratex-blue)]">
          <span className="inline-flex min-w-0 items-center gap-2">
            <List size={15} className="shrink-0 text-[var(--stratex-blue)]" />
            <span className="truncate">View All Notices</span>
          </span>
          <ArrowRight size={14} className="shrink-0 text-[var(--stratex-blue)]" />
        </button>
        <ActionButton icon={Bell}>Subscribe to Notices</ActionButton>
        {notice.attachment?.url ? <ActionButton icon={Download} href={notice.attachment.url}>Download Attachment</ActionButton> : null}
        <ActionButton icon={FileText}>Report an Issue</ActionButton>
        <ActionButton icon={UserRound}>Contact Author</ActionButton>
      </div>
    </section>
  </aside>
  );
};

export default NoticeDetailSidebar;
