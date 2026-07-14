import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bell, CalendarDays, Download, FileText, List, Printer, Send, UserRound } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getNotifications, markNotificationRead } from "../../services/notificationService";
import AnnouncementDetailCard, {
  getAttachmentName,
  getAttachmentUrl,
  getNotificationAttachments,
} from "./notifications/AnnouncementDetailCard";
import NotificationEmptyState from "./notifications/NotificationEmptyState";
import NotificationLoadingState from "./notifications/NotificationLoadingState";
import {
  formatNotificationDate,
  getAudienceLabel,
  getNotificationDocument,
  getNotificationId,
  getSenderName,
} from "../../config/notificationConfig";

const NotificationPriorityBadge = ({ priority }) => {
  const value = priority || "normal";
  const tone =
    value === "urgent"
      ? "bg-red-50 text-[var(--error)]"
      : value === "high"
        ? "bg-amber-50 text-[var(--warning)]"
        : "bg-blue-50 text-[var(--stratex-blue)]";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${tone}`}>
      {value}
    </span>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[96px_1fr] gap-3 text-xs">
    <span className="font-bold text-[var(--university-muted)]">{label}</span>
    <span className="min-w-0 break-words text-right font-black text-[var(--university-ink)]">{value}</span>
  </div>
);

const ActionButton = ({ children, href, icon: Icon, onClick }) => {
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

  return <button type="button" onClick={onClick} className={className}>{content}</button>;
};

const NotificationDetailHeader = ({ attachments, notification, onBack }) => {
  const firstAttachment = attachments[0];
  const attachmentUrl = firstAttachment ? getAttachmentUrl(firstAttachment) : "";

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
          <span>Dashboard</span>
          <span>/</span>
          <span>Notifications</span>
          <span>/</span>
          <span className="line-clamp-1 text-[var(--university-ink)]">{notification?.title || "Notification Details"}</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
            title="Back to notifications"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black leading-tight text-[var(--university-ink)]">Notification Details</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-xs font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
        >
          <Printer size={15} />
          Print
        </button>
        {attachmentUrl ? (
          <a
            href={attachmentUrl}
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
};

const NotificationDetailSidebar = ({ attachments, item, notification, onBack }) => {
  const senderName = getSenderName(notification.sender);
  const firstAttachment = attachments[0];
  const attachmentUrl = firstAttachment ? getAttachmentUrl(firstAttachment) : "";
  const attachmentName = firstAttachment ? getAttachmentName(firstAttachment) : "";

  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
      <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[var(--university-ink)]">Notification Information</h2>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-[96px_1fr] gap-3 text-xs">
            <span className="font-bold text-[var(--university-muted)]">Priority</span>
            <span className="text-right"><NotificationPriorityBadge priority={notification.priority} /></span>
          </div>
          <InfoRow label="Shared At" value={formatNotificationDate(notification.createdAt || item.deliveredAt)} />
          <InfoRow label="Audience" value={getAudienceLabel(notification.audience)} />
          <InfoRow label="Scope" value={notification.type || "system"} />
          <InfoRow label="Sender" value={senderName} />
          <InfoRow label="Delivery" value={notification.metadata?.delivery || "Email, in-app"} />
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[var(--university-ink)]">Reference Document</h2>
        <div className="mt-4 space-y-3">
          <InfoRow label="Files" value={String(attachments.length)} />
          <InfoRow label="Primary" value={attachmentName || "Not attached"} />
          <InfoRow label="Status" value={attachmentUrl ? "Available" : "No document"} />
        </div>
        <p className="mt-4 text-[11px] font-bold text-[var(--university-muted)]">
          Supporting documents can be previewed in the main panel.
        </p>
      </section>

      <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[var(--university-ink)]">Related Actions</h2>
        <div className="mt-4 space-y-1">
          <ActionButton icon={List} onClick={onBack}>View All Notifications</ActionButton>
          {attachmentUrl ? <ActionButton icon={Download} href={attachmentUrl}>Download Document</ActionButton> : null}
          <ActionButton icon={FileText}>Report an Issue</ActionButton>
          <ActionButton icon={Bell}>Manage Notification</ActionButton>
          <ActionButton icon={UserRound}>Contact Sender</ActionButton>
        </div>
      </section>

      <section className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs font-semibold leading-5 text-[var(--stratex-blue)] shadow-sm">
        <span className="inline-flex items-center gap-2">
          <Send size={14} />
          This notification was delivered to {getAudienceLabel(notification.audience).toLowerCase()}.
        </span>
      </section>
    </aside>
  );
};

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(location.state?.notificationItem || null);
  const [loading, setLoading] = useState(!location.state?.notificationItem);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotification = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await getNotifications({
          limit: 100,
          sortBy: "createdAt",
          order: "desc",
        });
        const found = (data?.data?.notifications || []).find(
          (notificationItem) => getNotificationId(notificationItem) === id,
        );

        setItem(found || null);

        if (!found) {
          setError("Notification not found.");
        }
      } catch {
        setError("Unable to load this notification.");
      } finally {
        setLoading(false);
      }
    };

    if (!item) {
      loadNotification();
    }
  }, [id, item]);

  useEffect(() => {
    if (!id) {
      return;
    }

    markNotificationRead(id).catch(() => {});
  }, [id]);

  const notification = getNotificationDocument(item);
  const attachments = getNotificationAttachments(notification);
  const handleBack = () => navigate("/dashboard/notifications");

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1480px] space-y-4">
          <div className="h-16 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="rounded-xl border border-[var(--university-border)] bg-white">
              <NotificationLoadingState />
            </div>
            <div className="h-[420px] animate-pulse rounded-xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          {error ? <p className="mb-3 text-sm font-bold text-[var(--error)]">{error}</p> : null}
          <NotificationEmptyState />
          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white"
          >
            <ArrowLeft size={14} />
            Back to Notifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <NotificationDetailHeader attachments={attachments} notification={notification} onBack={handleBack} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <main className="min-w-0 space-y-4">
            <AnnouncementDetailCard item={item} />
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-[var(--stratex-blue)]">
              This notification is marked as read when you open this page. Use the document controls above to preview, download, or print reference files.
            </div>
          </main>

          <NotificationDetailSidebar
            attachments={attachments}
            item={item}
            notification={notification}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
