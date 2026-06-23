import axiosInstance from "../utils/axiosInstance";

export const getNotices = () =>
  axiosInstance.get("/notices");

export const createNotice = (data) =>
  axiosInstance.post("/notices", data);

export const updateNotice = (id, data) =>
  axiosInstance.put(`/notices/${id}`, data);

export const deleteNotice = (id) =>
  axiosInstance.delete(`/notices/${id}`);