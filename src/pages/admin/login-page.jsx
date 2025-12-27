import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toastError("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.message || "Login failed");
        return;
      }

      const { user, token } = data;
      localStorage.setItem("token", token);

      // 🔥 ROLE BASED REDIRECT
      if (user.role === "CLIENT" && user.galleryCode) {
        navigate(`/g/${user.galleryCode}`);
        return;
      }

      navigate("/admin");
    } catch (err) {
      toastError("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          {role === "client" ? "Client Login" : "Admin Login"}
        </h1>

        <p className="text-muted-foreground text-center mb-6">
          {role === "client"
            ? "Login using the credentials sent to your email"
            : "Login to manage events, photos, and orders"}
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
