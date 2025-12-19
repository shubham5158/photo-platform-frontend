import client from "./Client.jsx";

export const getProfileApi = async () => {
  const res = await client.get("/auth/me");
  return res.data;
};
