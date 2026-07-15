import axiosInstance from "../utils/axiosInstance";

export const getSchools = (params = {}) =>
  axiosInstance.get("/schools", { params });

export const getSchoolById = (id) =>
  axiosInstance.get(`/schools/${id}`);

export const createSchool = (data) =>
  axiosInstance.post("/schools", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

export const updateSchool = (id, data) =>
  axiosInstance.put(`/schools/${id}`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

export const deleteSchool = (id) =>
  axiosInstance.delete(`/schools/${id}`);

export const uploadSchoolsCsv = (data) =>
  axiosInstance.post("/schools/bulk", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
