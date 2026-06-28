import axiosInstance from "../utils/axiosInstance";

export const getNotifications = (params = {}) =>
  axiosInstance.get("/notifications", { params });

export const getUnreadNotificationCount = () =>
  axiosInstance.get("/notifications/unread-count");

export const markNotificationRead = (id) =>
  axiosInstance.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  axiosInstance.patch("/notifications/read-all");

export const pinNotification = (id) =>
  axiosInstance.patch(`/notifications/${id}/pin`);

export const unpinNotification = (id) =>
  axiosInstance.patch(`/notifications/${id}/unpin`);

export const deleteNotification = (id) =>
  axiosInstance.delete(`/notifications/${id}`);
