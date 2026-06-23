import axiosInstance from "../utils/axiosInstance";

export const getEvents = () =>
  axiosInstance.get("/events");

export const createEvent = (data) =>
  axiosInstance.post("/events", data);

export const updateEvent = (id, data) =>
  axiosInstance.put(`/events/${id}`, data);

export const deleteEvent = (id) =>
  axiosInstance.delete(`/events/${id}`);