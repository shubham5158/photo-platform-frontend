import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi } from "../api/Auth.jsx";
import { getProfileApi } from "../api/Profile.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfileApi();
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem("token", data.token);
    await loadProfile();
  };

  // ✅ OTP SAFE REGISTER
  const register = async (name, email, password) => {
    // 🔥 IMPORTANT: remove any old auth
    localStorage.removeItem("token");
    setUser(null);

    const data = await registerApi({ name, email, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
