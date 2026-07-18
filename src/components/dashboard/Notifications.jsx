import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
} from "../../services/notificationService";
import AnnouncementCard from "./notifications/AnnouncementCard";
import AnnouncementHeader from "./notifications/AnnouncementHeader";
import AnnouncementShell from "./notifications/AnnouncementShell";
import AnnouncementToolbar from "./notifications/AnnouncementToolbar";
import NotificationEmptyState from "./notifications/NotificationEmptyState";
import NotificationLoadingState from "./notifications/NotificationLoadingState";
import NotificationPagination from "./notifications/NotificationPagination";
import { getNotificationId } from "../../config/notificationConfig";
import { useAuth } from "../../context/AuthContext";
import useSocketListener from "../../hooks/useSocketListener";

const initialFilters = {
  search: "",
  isRead: "",
  page: 1,
};

const roleLabels = {
  superAdmin: "Super Admin",
  schoolAdmin: "School Admin",
  faculty: "Faculty",
  coordinator: "Coordinator",
  student: "Student",
  examCell: "Exam Cell",
};

const getWorkspaceLabel = (user) => {
  const role = user?.primaryRole || user?.roles?.[0];
  const label =
    roleLabels[role] ||
    String(role || "User").replace(/([A-Z])/g, " $1").trim();

  return `${label} Workspace`;
};

const Notifications = () => {
  const { user } = useAuth();
  useSocketListener();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const query = useMemo(() => {
    const params = {
      page: filters.page,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    };

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.isRead) {
      params.isRead = filters.isRead;
    }

    return params;
  }, [filters]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getNotifications(query);
      const apiNotifications = data?.data?.notifications || [];

      setNotifications(apiNotifications);
      setUnreadCount(data?.data?.unreadCount || 0);
      setPagination(data?.pagination || null);
    } catch {
      setError("Unable to load announcements. Please try again.");
      setNotifications([]);
      setUnreadCount(0);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadNotifications();

    const handleRealtime = (e) => {
      try {
        const payload = e.detail || e;
        const newNotification = payload.notification;
        if (newNotification) {
          // preprend and refresh badge
          setNotifications((current) => [
            { notification: newNotification, deliveredAt: payload.deliveredAt, _id: newNotification._id },
            ...current,
          ]);
          setUnreadCount((c) => c + 1);
        }
      } catch (err) {
        console.error('realtime notification handler', err);
      }
    };

    window.addEventListener('socket:notification', handleRealtime);
    const handleRealtimeRemoval = (e) => {
      try {
        const payload = e.detail || e;
        const removedNotificationIds = payload.notificationIds || [payload.notificationId].filter(Boolean);
        if (!removedNotificationIds.length) return;
        const removedSet = new Set(removedNotificationIds.map(String));

        setNotifications((current) => {
          const unreadRemoved = current.filter(
            (item) => removedSet.has(String(getNotificationId(item))) && item.isRead === false,
          ).length;

          if (unreadRemoved) setUnreadCount((count) => Math.max(0, count - unreadRemoved));

          return current.filter((item) => !removedSet.has(String(getNotificationId(item))));
        });
      } catch (err) {
        console.error('realtime notification removal handler', err);
      }
    };

    window.addEventListener('socket:notification-removed', handleRealtimeRemoval);

    return () => {
      window.removeEventListener('socket:notification', handleRealtime);
      window.removeEventListener('socket:notification-removed', handleRealtimeRemoval);
    };

  }, [loadNotifications]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const handleMarkAllRead = async () => {
    setActionLoading("read-all");
    setError("");

    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch {
      setError("Unable to mark announcements as read.");
    } finally {
      setActionLoading("");
    }
  };

  const handleClearNotification = async (id) => {
    setActionLoading(`clear-${id}`);
    setError("");

    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch {
      setError("Unable to clear this announcement.");
    } finally {
      setActionLoading("");
    }
  };

  const handleClearAll = async () => {
    setActionLoading("clear-all");
    setError("");

    try {
      const ids = notifications.map((item) => getNotificationId(item));

      await Promise.all(ids.map((id) => deleteNotification(id)));
      await loadNotifications();
    } catch {
      setError("Unable to clear all announcements.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <AnnouncementShell>
      <AnnouncementHeader
        actionLoading={actionLoading}
        canClear={notifications.length > 0}
        eyebrow={getWorkspaceLabel(user)}
        unreadCount={unreadCount}
        onClearAll={handleClearAll}
        onMarkAllRead={handleMarkAllRead}
      />

      <AnnouncementToolbar filters={filters} onChange={updateFilter} />

      {error && (
        <div className="mb-5 rounded-2xl border border-[color-mix(in_srgb,var(--error)_25%,white)] bg-[color-mix(in_srgb,var(--error)_8%,white)] px-5 py-3 text-sm font-medium text-[var(--error)]">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="rounded-3xl border border-[var(--university-border)] bg-white">
            <NotificationLoadingState />
          </div>
        ) : notifications.length ? (
          notifications.map((item) => (
            <AnnouncementCard
              key={item._id || item.notificationId || item.notification?._id}
              clearing={actionLoading === `clear-${getNotificationId(item)}`}
              item={item}
              onClear={handleClearNotification}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-[var(--university-border)] bg-white">
            <NotificationEmptyState />
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <NotificationPagination
          pagination={pagination}
          onPageChange={(page) => updateFilter("page", page)}
        />
      </div>
    </AnnouncementShell>
  );
};

export default Notifications;
