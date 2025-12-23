import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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

        // 🔐 login
        const loggedInUser = await login(email, password);

        toastSuccess("Login successful!");

        if (loggedInUser.role === "ADMIN") {
          navigate("/admin");
        } else if (loggedInUser.role === "CLIENT" && loggedInUser.galleryCode) {
          navigate(`/g/${loggedInUser.galleryCode}`);
        } else {
          // fallback
          navigate("/");
        }
      } catch (err) {
        toastError(err?.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, navigate, loading]
  );

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div
        className="hidden lg:flex w-1/2 justify-around items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.7)),url(https://images.unsplash.com/photo-1650825556125-060e52d40bd0)",
        }}
      >
        <div className="w-full px-20 space-y-6">
          <h1 className="text-white font-bold text-4xl">
            Hemant Gogawale Photostudio
          </h1>
          <p className="text-white">
            Manage events, galleries & clients securely
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white">
        <div className="w-full px-8 md:px-32 lg:px-24">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-md shadow-2xl p-6"
          >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Admin Login
            </h1>
            <p className="text-sm text-gray-600 mb-8">Secure Login</p>

            <input
              className="border mb-4 px-3 py-2 rounded-2xl w-full"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative border mb-6 px-3 py-2 rounded-2xl">
              <input
                className="w-full outline-none"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-2 rounded-2xl text-white font-semibold transition-all ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm mt-4 text-center text-gray-500">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-indigo-600 cursor-pointer font-semibold"
              >
                Create one
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
