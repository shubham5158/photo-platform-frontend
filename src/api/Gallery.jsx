import api from "./Client.jsx";

export const getGalleryByCodeApi = async (code) => {
  const res = await api.get(`/gallery/${code}`);
  return res.data;
};

export const getPricePreviewApi = async (code, photoIds) => {
  const res = await api.post(`/gallery/${code}/price-preview`, { photoIds });
  return res.data;
};
