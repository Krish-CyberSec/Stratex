import axiosInstance from "../utils/axiosInstance";

export const getSchools = () =>
  axiosInstance.get("/schools");

export const createSchool = (data) =>
  axiosInstance.post("/schools", data);

export const updateSchool = (id, data) =>
  axiosInstance.put(`/schools/${id}`, data);

export const deleteSchool = (id) =>
  axiosInstance.delete(`/schools/${id}`);