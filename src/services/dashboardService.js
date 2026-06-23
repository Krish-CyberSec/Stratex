import axiosInstance from "../utils/axiosInstance";

export const getDashboardStats = () =>
  axiosInstance.get("/dashboard/stats");

export const getRecentUsers = () =>
  axiosInstance.get("/dashboard/recent-users");

export const getRecentActivities = () =>
  axiosInstance.get("/dashboard/recent-activities");

export const getRecentNotices = () =>
  axiosInstance.get("/dashboard/recent-notices");

export const getUpcomingEvents = () =>
  axiosInstance.get("/dashboard/upcoming-events");