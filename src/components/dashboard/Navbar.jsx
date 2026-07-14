import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { InboxIcon } from "@primer/octicons-react";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
} from "../../services/notificationService";
import {
  formatShortDate,
  getNotificationDocument,
  getNotificationId,
  getNotificationTargetPath,
  getSenderName,
  truncateText,
} from "../../config/notificationConfig";
import NotificationAvatar from "./notifications/NotificationAvatar";
import { useAuth } from "../../context/AuthContext";
import useSocketListener from "../../hooks/useSocketListener";

const getFullName = (user) =>
  user?.fullName ||
  [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ") ||
  "Profile User";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const getProfileImage = (user) => user?.profileImage || user?.profilePicture || "";

// import {} from 'lucide-react'
const Navbar = () => {
  const { user } = useAuth();
  const [profileClicked, setProfileClicked] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const getPreviewNotifications = (items) => {
    return notificationFilter === "unread"
      ? items.filter((item) => !item.isRead)
      : items;
  };

  const loadNotificationPreview = async () => {
    setNotificationLoading(true);

    try {
      const [feedResponse, countResponse] = await Promise.all([
        getNotifications({ limit: 20, sortBy: "createdAt", order: "desc" }),
        getUnreadNotificationCount(),
      ]);
      const apiNotifications = feedResponse.data?.data?.notifications || [];

      setNotifications(apiNotifications);
      setUnreadCount(countResponse.data?.data?.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  };

  useSocketListener();

  useEffect(() => {
    loadNotificationPreview();
  }, []);

  useEffect(() => {
    const handleRealtime = (e) => {
      try {
        const payload = e.detail || e;
        const newNotification = payload.notification;
        if (!newNotification) return;

        setNotifications((current) => [
          { notification: newNotification, deliveredAt: payload.deliveredAt, _id: newNotification._id },
          ...current,
        ]);
        setUnreadCount((count) => count + 1);
      } catch (err) {
        console.error("Navbar realtime notification handler", err);
      }
    };

    window.addEventListener("socket:notification", handleRealtime);
    return () => {
      window.removeEventListener("socket:notification", handleRealtime);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationToggle = () => {
    setNotificationOpen((prev) => !prev);
    setProfileClicked(false);
    loadNotificationPreview();
  };

  const handleNotificationClick = async (item) => {
    const notificationId = getNotificationId(item);

    try {
      if (!String(notificationId).startsWith("demo-")) {
        await markNotificationRead(notificationId);
      }
    } catch {
      // Keep the dropdown usable even if the request fails.
    }

    setNotificationOpen(false);
    const targetPath = getNotificationTargetPath(item) || `/dashboard/notifications/${notificationId}`;
    navigate(targetPath, targetPath.includes("/dashboard/notifications") ? {
      state: { notificationItem: item },
    } : undefined);
  };

  const previewNotifications = getPreviewNotifications(notifications);
  const userName = getFullName(user);
  const profileImage = getProfileImage(user);

  //
  return (
    <>
      <div  className="fixed z-50 flex h-16 w-screen items-center bg-[var(--university-ink)] text-white ">
        <div className="w-[40%] flex items-center ps-2 ">
          <img
            src={logo}
            alt=""
            className="rounded-full  bg-[#eef7fc] w-9.5 "
          />
          <nav className="ps-2">
            <NavLink to="/dashboard" end>
              <p className="font-bold text-[--navbar-text] text-[12px] lg:text-[16px]">
                Dashboard
              </p>
              <p className="font-light text-[7px] lg:text-[8px]">
                Powered by Stratex
              </p>
            </NavLink>
          </nav>
        </div>
        {/* profile dropdown */}
        <div
          className=" w-full md:w-72 absolute z-50 top-0  md:right-3 "
          style={{ display: profileClicked ? "block" : "none" }}
        >
          {profileClicked && (
            <div className="w-full md:w-72 absolute top-0 md:top-13 md:right-3 z-50">
              <ProfileDropdown onClose={() => setProfileClicked(false)} />
            </div>
          )}
        </div>
        <div className="w-[60%]  flex flex-row-reverse  items-center px-2 gap-3">
          <div className="group">
            <button
              type="button"
              onClick={() => setProfileClicked((prev) => !prev)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--stratex-blue)] text-xs font-bold text-white ring-2 ring-white/15"
              aria-label="Open user navigation menu"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${userName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(userName)
              )}
            </button>
            <div className="absolute top-10 right-3 z-10 h-8 w-45 flex items-center rounded-lg rounded-tr-xs bg-[var(--stratex-navy-light20)] opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
              <p className="pl-3 text-xs text-[var(--text-inverse)]">
                Open user navigation menu
              </p>
            </div>
          </div>

          {/* quick links  */}

          <div className="hidden sm:block" ref={notificationRef}>
            <div className="relative">
              <button
                type="button"
                onClick={handleNotificationToggle}
                className="relative rounded-lg border border-white/30 p-2 transition hover:bg-[var(--navbar-hover)]"
                aria-label="Open notifications"
              >
                <InboxIcon className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--university-red)] px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-11 z-50 w-[min(25rem,calc(100vw-1rem))] overflow-hidden rounded-3xl border border-[var(--university-border)] bg-white text-[var(--university-ink)] shadow-[0_24px_70px_rgba(15,39,68,0.24)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--university-border)] px-5 py-4">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--university-ink)]">
                        Notifications
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--university-muted)]">
                        {unreadCount
                          ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                          : "You are all caught up"}
                      </p>
                    </div>

                    <div className="flex rounded-xl bg-[var(--university-surface-soft)] p-1 text-xs font-semibold">
                      {[
                        ["all", "All"],
                        ["unread", "Unread"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNotificationFilter(value)}
                          className={`rounded-lg px-3 py-1.5 transition ${
                            notificationFilter === value
                              ? "bg-white text-[var(--university-ink)] shadow-sm"
                              : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[28rem] overflow-y-scroll [scrollbar-width:thin] [scrollbar-color:var(--university-blue)_var(--university-surface-soft)]">
                    {notificationLoading ? (
                      <div className="px-5 py-10 text-center text-sm text-[var(--university-muted)]">
                        Loading notifications...
                      </div>
                    ) : previewNotifications.length ? (
                      previewNotifications.map((item) => {
                        const notification = getNotificationDocument(item);
                        const notificationId = getNotificationId(item);
                        const senderName = getSenderName(notification.sender);

                        return (
                          <button
                            type="button"
                            key={notificationId}
                            onClick={() => handleNotificationClick(item)}
                            className="group flex w-full min-w-0 gap-4 border-b border-[var(--university-border)] px-5 py-4 text-left transition last:border-b-0 hover:bg-[var(--university-surface-soft)]"
                          >
                            <NotificationAvatar
                              sender={notification.sender}
                              badge={(notification.type || "n").slice(0, 1)}
                            />

                            <span className="min-w-0 flex-1">
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="truncate text-sm font-semibold text-[var(--university-ink)]">
                                  {senderName}
                                </span>
                                <span className="shrink-0 text-xs text-[var(--university-muted)]">
                                  {formatShortDate(
                                    notification.createdAt || item.deliveredAt,
                                  )}
                                </span>
                              </span>

                              <span className="mt-1 block truncate text-sm font-semibold text-[var(--university-ink)]">
                                {notification.title || "Notification"}
                              </span>
                              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[var(--university-muted)]">
                                {truncateText(
                                  notification.message || "No message available",
                                  118,
                                )}
                              </span>
                            </span>

                            {!item.isRead && (
                              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--success)]" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-5 py-10 text-center text-sm text-[var(--university-muted)]">
                        No notifications match this filter.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[var(--university-border)] bg-[var(--university-surface-soft)] px-5 py-3 text-right">
                    <NavLink
                      to="/dashboard/notifications"
                      onClick={() => setNotificationOpen(false)}
                      className="text-sm font-semibold text-[var(--university-blue-dark)] transition hover:text-[var(--university-blue)]"
                    >
                      View all notifications
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
