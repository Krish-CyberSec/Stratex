import axiosInstance from "../utils/axiosInstance";

export const getEvents = (params = {}) =>
  axiosInstance.get("/events", { params });

export const getEventById = (id) =>
  axiosInstance.get(`/events/${id}`);

export const createEvent = (data) =>
  axiosInstance.post("/events", data);

export const updateEvent = (id, data) =>
  axiosInstance.put(`/events/${id}`, data);

export const deleteEvent = (id) =>
  axiosInstance.delete(`/events/${id}`);
