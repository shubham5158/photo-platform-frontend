import api from "./Client.jsx";

export const createOrderFromGalleryApi = async (code, photoIds, clientEmail) => {
  const res = await api.post(`/orders/gallery/${code}`, {
    photoIds,
    clientEmail,
  });
  return res.data;
};

export const getAdminOrdersApi = async () => {
  const res = await api.get("/orders/admin");
  return res.data;
};

export const getDownloadByTokenApi = async (token) => {
  const res = await api.get(`/download/${token}`);
  return res.data;
};
