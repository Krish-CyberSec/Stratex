import React from "react";
import { CalendarDays, FileText } from "lucide-react";
import {
  formatNotificationDate,
  formatShortDate,
  getAudienceLabel,
  getNotificationDocument,
  getNotificationTags,
  getSenderName,
} from "../../../config/notificationConfig";

const InfoBlock = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--university-muted)]">
      {label}
    </p>
    <p className="mt-1 text-xs font-semibold text-[var(--university-ink)]">
      {value}
    </p>
  </div>
);

const AttachmentCard = ({ attachment }) => (
  <div className="flex max-w-sm gap-3 rounded-2xl border border-[var(--university-border)] bg-white p-3 shadow-sm">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--university-surface-soft)] text-[var(--university-blue-dark)]">
      <FileText size={17} />
    </div>
    <div className="min-w-0">
      <p className="truncate text-xs font-semibold text-[var(--university-ink)]">
        {attachment.name || attachment.fileName || "Attachment"}
      </p>
      <p className="mt-0.5 text-[11px] text-[var(--university-muted)]">
        {attachment.size || attachment.type || "Document"}
      </p>
    </div>
  </div>
);

const AnnouncementDetailCard = ({ item }) => {
  const notification = getNotificationDocument(item);
  const senderName = getSenderName(notification.sender);
  const tags = getNotificationTags(notification);
  const attachments = notification.metadata?.attachments || [];

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--university-border)] bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[color-mix(in_srgb,var(--stratex-teal)_10%,white)] px-3 py-1 text-[11px] font-medium text-[var(--university-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="max-w-4xl text-2xl font-bold leading-tight text-[var(--university-ink)]">
          {notification.priority === "urgent" ? "Warning: " : ""}
          {notification.title || "Notification"}
        </h1>

        <div className="mt-7 flex items-center gap-4">
          <img
            src={
              notification.sender?.profilePicture ||
              "https://tse1.mm.bing.net/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            }
            alt=""
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--university-ink)]">
              {senderName}
            </p>
            <p className="text-xs text-[var(--university-muted)]">
              {formatShortDate(notification.createdAt || item.deliveredAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-[var(--university-border)] px-6 py-5 sm:px-8">
        <div className="max-w-4xl whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">
          {notification.message || "No message available"}
        </div>
      </div>

      <div className="px-6 py-5 sm:px-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--university-muted)]">
          Attachments
        </p>
        {attachments.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {attachments.map((attachment, index) => (
              <AttachmentCard
                key={`${attachment.name || attachment.fileName || "file"}-${index}`}
                attachment={attachment}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--university-muted)]">
            No attachments added to this notification.
          </p>
        )}
      </div>

      <div className="grid gap-5 border-t border-[var(--university-border)] bg-[var(--university-surface-soft)] px-6 py-5 sm:grid-cols-3 sm:px-8">
        <InfoBlock
          label="Audience"
          value={getAudienceLabel(notification.audience)}
        />
        <InfoBlock label="Scope" value={notification.type || "system"} />
        <InfoBlock
          label="Delivery"
          value={notification.metadata?.delivery || "Email, in-app"}
        />
        <div className="sm:col-span-3">
          <p className="inline-flex items-center gap-2 text-xs text-[var(--university-muted)]">
            <CalendarDays size={14} />
            Shared {formatNotificationDate(notification.createdAt || item.deliveredAt)}
          </p>
        </div>
      </div>
    </article>
  );
};

export default AnnouncementDetailCard;
