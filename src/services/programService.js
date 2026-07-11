import axiosInstance from "../utils/axiosInstance";

export const getPrograms = (params = {}) =>
  axiosInstance.get("/programs", { params });

export const getProgramById = (id) =>
  axiosInstance.get(`/programs/${id}`);

export const createProgram = (data) =>
  axiosInstance.post("/programs", data);

export const updateProgram = (id, data) =>
  axiosInstance.put(`/programs/${id}`, data);

export const deleteProgram = (id) =>
  axiosInstance.delete(`/programs/${id}`);
