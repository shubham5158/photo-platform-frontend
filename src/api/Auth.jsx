import client from "./Client.jsx";

export const loginApi = async (email, password) => {
  const res = await client.post("/auth/login", { email, password });
  return res.data;
};

export const registerApi = async ({ name, email, password }) => {
  const res = await client.post("/auth/register", { name, email, password });
  return res.data;
};

export const verifyOtpApi = async (email, otp) => {
  const res = await client.post("/auth/verify-otp", {
    email,
    otp: String(otp).trim(),
  });
  return res.data;
};
