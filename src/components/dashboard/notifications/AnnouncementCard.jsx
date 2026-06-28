import React from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatShortDate,
  getActionLabel,
  getNotificationDocument,
  getNotificationId,
  getNotificationTags,
  getSenderName,
  truncateText,
} from "../../../config/notificationConfig";

const AnnouncementCard = ({ clearing, item, onClear }) => {
  const notification = getNotificationDocument(item);
  const notificationId = getNotificationId(item);
  const senderName = getSenderName(notification.sender);
  const tags = getNotificationTags(notification);

  return (
    <article className="rounded-3xl border border-[var(--university-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src={
              notification.sender?.profilePicture ||
              "https://tse1.mm.bing.net/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            }
            alt=""
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[var(--university-surface-soft)]"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--university-ink)]">
              {senderName}
            </p>
            <p className="text-xs text-[var(--university-muted)]">
              {formatShortDate(notification.createdAt || item.deliveredAt)}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[color-mix(in_srgb,var(--stratex-teal)_10%,white)] px-3 py-1 text-xs font-medium text-[var(--stratex-teal-dark)]">
          {item.isRead ? "Read" : "Unread"}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[color-mix(in_srgb,var(--stratex-teal)_10%,white)] px-3 py-1 text-xs font-medium text-[var(--university-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-bold leading-tight text-[var(--university-ink)]">
        {notification.title || "Notification"}
      </h2>

      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
        {truncateText(notification.message || "No message available")}
      </p>

      <div className="mt-7 flex flex-col gap-4 border-t border-[var(--university-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--university-muted)]">
          <span>Shared by {senderName}</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatShortDate(notification.createdAt || item.deliveredAt)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onClear(notificationId)}
            disabled={clearing}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--error)] transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={14} />
            Clear
          </button>

          <Link
            to={`/dashboard/notifications/${notificationId}`}
            state={{ notificationItem: item }}
            className="w-fit text-sm font-semibold capitalize text-[var(--success)] transition hover:text-[var(--stratex-teal-dark)]"
          >
            {getActionLabel(notification.type)}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default AnnouncementCard;
