import api from "./Client.jsx";

export const getGlobalDiscountApi = async () => {
  const res = await api.get("/discounts/global");
  return res.data;
};

export const updateGlobalDiscountApi = async (payload) => {
  const res = await api.put("/discounts/global", payload);
  return res.data;
};
