import React from "react";
import { CalendarDays, Download, ExternalLink, FileText, Maximize2, Printer, Send } from "lucide-react";
import {
  formatNotificationDate,
  getAudienceLabel,
  getNotificationDocument,
  getNotificationTags,
  getSenderName,
} from "../../../config/notificationConfig";
import NotificationAvatar from "./NotificationAvatar";

export const formatNotificationFileSize = (size) => {
  if (!size) return "Document";
  if (typeof size === "string") return size;
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const getAttachmentUrl = (attachment = {}) =>
  attachment.url || attachment.fileUrl || attachment.href || attachment.path || "";

export const getAttachmentName = (attachment = {}) =>
  attachment.name || attachment.fileName || attachment.title || "Supporting document";

const isPdf = (attachment = {}) => {
  const name = getAttachmentName(attachment).toLowerCase();
  const type = String(attachment.fileType || attachment.type || attachment.mimeType || "").toLowerCase();
  return type.includes("pdf") || name.endsWith(".pdf");
};

export const getNotificationAttachments = (notification = {}) => {
  const metadata = notification.metadata || {};
  const attachments = metadata.attachments || metadata.referenceDocuments || metadata.documents || [];
  const singleAttachment = metadata.attachment || metadata.referenceDocument || notification.attachment;
  const normalized = Array.isArray(attachments) ? attachments : [attachments];

  if (singleAttachment) {
    normalized.push(singleAttachment);
  }

  return normalized.filter((attachment) => attachment && getAttachmentUrl(attachment));
};

const PriorityBadge = ({ priority }) => {
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

const SupportingDocument = ({ attachment }) => {
  const url = getAttachmentUrl(attachment);
  const name = getAttachmentName(attachment);
  const typeLabel = attachment.fileType || attachment.type || "File";

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 border-b border-[var(--border-light)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FileText size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-[var(--university-ink)]">{name}</h3>
            <p className="mt-1 text-xs font-bold text-[var(--university-muted)]">
              {typeLabel} &bull; {formatNotificationFileSize(attachment.size)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]">
            <Maximize2 size={14} />
            Full Screen
          </a>
          <a href={url} download className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-bold text-[var(--university-ink)] hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]">
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
          title={name}
          src={url}
          className="mt-4 h-[360px] w-full rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)] sm:h-[420px]"
        />
      ) : (
        <div className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--surface-soft)] p-6 text-center">
          <FileText size={34} className="text-[var(--stratex-blue)]" />
          <p className="mt-3 text-sm font-black text-[var(--university-ink)]">Preview unavailable for this file type</p>
          <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[var(--stratex-blue)]">
            Open supporting file
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </section>
  );
};

const AnnouncementDetailCard = ({ item }) => {
  const notification = getNotificationDocument(item);
  const senderName = getSenderName(notification.sender);
  const tags = getNotificationTags(notification);
  const attachments = getNotificationAttachments(notification);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6">
        <PriorityBadge priority={notification.priority} />

        <h2 className="mt-4 break-words text-2xl font-black leading-tight text-[var(--university-ink)]">
          {notification.priority === "urgent" ? "Warning: " : ""}
          {notification.title || "Notification"}
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[var(--border-light)] pb-4 text-xs font-bold text-[var(--university-muted)]">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={15} className="text-[var(--stratex-blue)]" />
            Shared on {formatNotificationDate(notification.createdAt || item.deliveredAt)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-2">
            <Send size={15} className="shrink-0 text-[var(--stratex-blue)]" />
            Audience:
            <span className="min-w-0 rounded-md bg-blue-50 px-2 py-1 text-[var(--stratex-blue)]">
              {getAudienceLabel(notification.audience)}
            </span>
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[var(--surface-soft)] px-3 py-3">
          <NotificationAvatar sender={notification.sender} />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[var(--university-ink)]">{senderName}</p>
            <p className="text-xs font-bold text-[var(--university-muted)]">Sender</p>
          </div>
        </div>

        <div className="mt-5 whitespace-pre-line break-words text-sm font-medium leading-7 text-[var(--university-ink)]">
          {notification.message || "No message available"}
        </div>

        {tags.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[color-mix(in_srgb,var(--stratex-teal)_10%,white)] px-3 py-1 text-[11px] font-bold text-[var(--university-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {attachments.length ? (
        attachments.map((attachment, index) => (
          <SupportingDocument
            key={`${getAttachmentName(attachment)}-${getAttachmentUrl(attachment)}-${index}`}
            attachment={attachment}
          />
        ))
      ) : (
        <section className="rounded-xl border border-dashed border-[var(--border-light)] bg-white px-4 py-8 text-center shadow-sm">
          <FileText size={28} className="mx-auto text-[var(--university-muted)]" />
          <p className="mt-3 text-sm font-black text-[var(--university-ink)]">No supporting document</p>
          <p className="mt-1 text-xs font-bold text-[var(--university-muted)]">
            Reference documents attached to this notification will appear here.
          </p>
        </section>
      )}
    </div>
  );
};

export default AnnouncementDetailCard;
