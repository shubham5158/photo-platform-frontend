import api from "./Client.jsx";

export const createEventApi = async (payload) => {
  const res = await api.post("/events", payload);
  return res.data;
};

export const getEventsApi = async (params = {}) => {
  const res = await api.get("/events", { params });
  return res.data;
};

export const getEventApi = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const updateEventApi = async (eventId, payload) => {
  const res = await api.patch(`/events/${eventId}`, payload);
  return res.data;
};

export const deleteEventApi = async (eventId) => {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
};
