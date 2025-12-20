import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await login(email, password);
        toastSuccess("Login successful!");
        navigate("/admin");
      } catch (err) {
        toastError(err?.response?.data?.message || "Login failed");
      }
    },
    [email, password, login, navigate]
  );

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div
        className="hidden lg:flex w-1/2 justify-around items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.7)),url(https://images.unsplash.com/photo-1650825556125-060e52d40bd0?auto=format&fit=crop&w=1170&q=80)",
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

            <div className="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">
              <input
                className="pl-2 w-full outline-none border-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
              />
            </div>

            <div className="flex items-center border-2 mb-10 py-2 px-3 rounded-2xl relative">
              <input
                className="pl-2 w-full outline-none border-none"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 text-gray-500"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="block w-full bg-indigo-600 py-2 rounded-2xl text-white font-semibold"
            >
              Login
            </button>

            <p className="text-sm mt-4 text-slate-400 text-center">
              Don’t have an account?{" "}
              <span
                className="text-amber-300 underline cursor-pointer"
                onClick={() => navigate("/register")}
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
