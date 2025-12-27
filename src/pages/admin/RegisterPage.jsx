import React, { useState, useCallback } from "react";
import { useAuth } from "../../context/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import { Eye, EyeOff, Loader2, Camera } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      try {
        setLoading(true);
        const res = await register(form.name, form.email, form.password);
        toastSuccess(res.message || "OTP Sent Successfully!");
        navigate("/verify-otp", { state: { email: form.email } });
      } catch (err) {
        toastError(err?.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
    [form, register, navigate, loading]
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-6">
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/logo.jpg"
                alt="Hemant Gogawale Photography"
                className="h-7 w-auto"
              />
              <span className="font-bold">Hemant Gogawale Photography</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">Create Admin Account</h1>
          <p className="text-muted-foreground text-sm">
            Register & verify your account via OTP
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm mt-4 text-center text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login?role=admin")}
            className="text-primary cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
