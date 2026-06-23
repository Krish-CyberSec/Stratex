import axiosInstance from "../utils/axiosInstance";

export const getSubjects = () =>
  axiosInstance.get("/subjects");

export const createSubject = (data) =>
  axiosInstance.post("/subjects", data);

export const updateSubject = (id, data) =>
  axiosInstance.put(`/subjects/${id}`, data);

export const deleteSubject = (id) =>
  axiosInstance.delete(`/subjects/${id}`);