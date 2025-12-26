import api from "./Client.jsx";

/**
 * ===============================
 * CLIENT – CREATE ORDER FROM GALLERY
 * ===============================
 */
export const createOrderFromGalleryApi = async (code, photoIds) => {
  const res = await api.post(`/orders/gallery/${code}`, {
    photoIds,
  });
  return res.data;
};

/**
 * ===============================
 * ADMIN – GET ALL ORDERS
 * 🔴 REQUIRED BY admin-home-page.jsx
 * ===============================
 */
export const getAdminOrdersApi = async () => {
  const res = await api.get("/orders/admin");
  return res.data;
};

/**
 * ===============================
 * CLIENT – DOWNLOAD BY TOKEN
 * ===============================
 */
export const getDownloadByTokenApi = async (token) => {
  const res = await api.get(`/download/${token}`);
  return res.data;
};
