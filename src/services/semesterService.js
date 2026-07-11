import axiosInstance from "../utils/axiosInstance";

export const getSemesters = (params = {}) =>
  axiosInstance.get("/semesters", { params });

export const getSemesterById = (id) =>
  axiosInstance.get(`/semesters/${id}`);
