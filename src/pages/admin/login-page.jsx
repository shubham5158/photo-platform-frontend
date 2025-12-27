import React, { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import { Eye, EyeOff, Loader2, Camera } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const role = searchParams.get("role") || "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      try {
        setLoading(true);

        const loggedInUser = await login(email, password);

        toastSuccess("Login successful!");

        if (loggedInUser.role === "CLIENT" && loggedInUser.galleryCode) {
          navigate(`/g/${loggedInUser.galleryCode}`);
          return;
        }

        if (loggedInUser.role === "ADMIN") {
          navigate("/admin");
          return;
        }

        navigate("/");
      } catch (err) {
        toastError(err?.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, navigate, loading]
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-6">
        {/* HEADER (ROLE BASED) */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <div className="flex flex-col items-center">
              <img
                src="/logo.png"
                alt="Hemant Gogawale Photography"
                className="h-16 w-auto"
              />
              
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">
            {role === "client" ? "Client Login" : "Admin Login"}
          </h1>

          <p className="text-muted-foreground text-sm">
            {role === "client"
              ? "Login using credentials sent to your email"
              : "Secure access to manage events & galleries"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-9 text-muted-foreground"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-primary text-primary-foreground py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* 👇 ONLY ADMIN SEES THIS */}
        {role === "admin" && (
          <p className="text-sm mt-4 text-center text-muted-foreground">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary cursor-pointer font-semibold hover:underline"
            >
              Register
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
