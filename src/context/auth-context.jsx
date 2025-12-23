import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { loginApi, registerApi } from "../api/Auth.jsx";
import { getProfileApi } from "../api/Profile.jsx";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load profile only once on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getProfileApi();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🚀 FAST LOGIN (no blocking)
  const login = useCallback(async (email, password) => {
  const data = await loginApi(email, password);

  localStorage.setItem("token", data.token);

  // 🔥 store full user (with role)
  setUser(data.user);

  // background refresh
  getProfileApi()
    .then((res) => setUser(res.user))
    .catch(() => {});
    return data.user;
}, []);


  const register = useCallback(async (name, email, password) => {
    localStorage.removeItem("token");
    setUser(null);
    return registerApi({ name, email, password });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);


  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
