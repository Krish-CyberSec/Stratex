import axiosInstance from "../utils/axiosInstance";

export const getPrograms = () =>
  axiosInstance.get("/programs");

export const createProgram = (data) =>
  axiosInstance.post("/programs", data);

export const updateProgram = (id, data) =>
  axiosInstance.put(`/programs/${id}`, data);

export const deleteProgram = (id) =>
  axiosInstance.delete(`/programs/${id}`);