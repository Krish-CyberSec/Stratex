import axiosInstance from "../utils/axiosInstance";

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const logoutUser = () => {
  return axiosInstance.post("/auth/logout");
};

export const getCurrentUser = () => {
  return axiosInstance.get("/auth/me");
};

export const setupPassword = (data) => {
  return axiosInstance.post("/auth/setup-password", data);
};
