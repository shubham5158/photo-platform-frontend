import client from "./Client.jsx";

export const registerApi = async (data) => {
  const res = await client.post("api/auth/register", data);
  return res.data;
};
