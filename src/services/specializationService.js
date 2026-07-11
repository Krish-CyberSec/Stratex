import axiosInstance from "../utils/axiosInstance";

export const getSpecializations = (params = {}) =>
  axiosInstance.get("/specializations", { params });

export const createSpecialization = (data) =>
  axiosInstance.post("/specializations", data);

export const updateSpecialization = (id, data) =>
  axiosInstance.put(`/specializations/${id}`, data);

export const deleteSpecialization = (id) =>
  axiosInstance.delete(`/specializations/${id}`);
