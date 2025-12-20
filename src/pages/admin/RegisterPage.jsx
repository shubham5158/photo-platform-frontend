import React, { useState, useCallback } from "react";
import { useAuth } from "../../context/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

  /* INPUT CHANGE */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* SUBMIT */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await register(form.name, form.email, form.password);
        toastSuccess(res.message || "OTP Sent Successfully!");
        navigate("/verify-otp", { state: { email: form.email } });
      } catch (err) {
        toastError(err?.response?.data?.message || "Registration failed");
      }
    },
    [form, register, navigate]
  );

  return (
    <div className="h-screen flex">
      {/* LEFT IMAGE SECTION */}
      <div
        className="hidden lg:flex w-1/2 justify-around items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.7)),url(https://images.unsplash.com/photo-1650825556125-060e52d40bd0?auto=format&fit=crop&w=1170&q=80)",
        }}
      >
        <div className="w-full px-20 space-y-6">
          <h1 className="text-white font-bold text-4xl font-sans">
            Hemant Gogawale Photostudio
          </h1>
          <p className="text-white">
            Secure registration with OTP verification
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white">
        <div className="w-full px-8 md:px-32 lg:px-24">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-md shadow-2xl p-6"
          >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Create Account
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-8">
              Register & verify via OTP
            </p>

            {/* NAME */}
            <div className="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
              <input
                className="pl-2 w-full outline-none border-none"
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
              <input
                className="pl-2 w-full outline-none border-none"
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl relative">
              <input
                className="pl-2 w-full outline-none border-none"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 text-gray-500"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="block w-full bg-indigo-600 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all text-white font-semibold mb-4"
            >
              Register
            </button>

            {/* LOGIN LINK */}
            <div className="flex justify-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
              </span>
              <span
                className="text-sm text-indigo-600 cursor-pointer font-semibold hover:underline ml-1"
                onClick={() => navigate("/admin/login")}
              >
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
