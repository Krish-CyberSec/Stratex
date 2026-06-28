import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getNotifications, markNotificationRead } from "../../services/notificationService";
import AnnouncementDetailCard from "./notifications/AnnouncementDetailCard";
import AnnouncementShell from "./notifications/AnnouncementShell";
import NotificationEmptyState from "./notifications/NotificationEmptyState";
import NotificationLoadingState from "./notifications/NotificationLoadingState";
import {
  getNotificationId,
} from "../../config/notificationConfig";

const NotificationDetail = () => {
  const { id } = useParams();
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

  return (
    <AnnouncementShell maxWidth="max-w-4xl">
      <Link
        to="/dashboard/notifications"
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--university-muted)] transition hover:text-[var(--university-ink)]"
      >
        <ArrowLeft size={14} />
        Back to Announcements
      </Link>

      {loading ? (
        <div className="rounded-2xl border border-[var(--university-border)] bg-white">
          <NotificationLoadingState />
        </div>
      ) : item ? (
        <AnnouncementDetailCard item={item} />
      ) : (
        <div className="rounded-2xl border border-[var(--university-border)] bg-white">
          {error && (
            <p className="border-b border-[var(--university-border)] px-5 py-3 text-sm font-medium text-[var(--error)]">
              {error}
            </p>
          )}
          <NotificationEmptyState />
        </div>
      )}
    </AnnouncementShell>
  );
};

export default NotificationDetail;
