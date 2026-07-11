import axiosInstance from "../utils/axiosInstance";

export const getNotices = (params = {}) =>
  axiosInstance.get("/notices", { params });

export const getNoticeById = (id) =>
  axiosInstance.get(`/notices/${id}`);

export const createNotice = (data) =>
  axiosInstance.post("/notices", data);

export const updateNotice = (id, data) =>
  axiosInstance.put(`/notices/${id}`, data);

export const deleteNotice = (id) =>
  axiosInstance.delete(`/notices/${id}`);
