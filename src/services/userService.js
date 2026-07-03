import axiosInstance from "../utils/axiosInstance";

export const getUsers = (params = {}) =>
  axiosInstance.get("/users", { params });

export const getUserById = (id) =>
  axiosInstance.get(`/users/${id}`);

export const createUser = (data) =>
  axiosInstance.post("/users", data);

export const updateUser = (id, data) =>
  axiosInstance.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  axiosInstance.delete(`/users/${id}`);
