import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context.jsx";
import { toastError } from "../../utils/toast.jsx";
import { Eye, EyeOff } from "lucide-react";

const ClientLandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState("client"); // client | admin
  const [code, setCode] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ======================
     CLIENT LOGIN
  ====================== */
  const handleClientLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(email, password);

      if (user?.role !== "CLIENT") {
        toastError("Not a client account");
        return;
      }

      navigate("/"); // client lands here, gallery via code
    } catch {
      toastError("Client login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     GALLERY CODE ACCESS
  ====================== */
  const handleGalleryAccess = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toastError("Enter gallery code");
      return;
    }
    navigate(`/g/${code.trim()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wide">
          Hemant Gogawale Studio
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("client")}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === "client"
                ? "bg-amber-400 text-black"
                : "border border-slate-600"
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === "admin"
                ? "bg-amber-400 text-black"
                : "border border-slate-600"
            }`}
          >
            Admin
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1579758682665-53a1a614eea6"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 to-slate-950" />

        <div className="relative text-center max-w-3xl px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Elite Sports & Bodybuilding Photography
          </h2>
          <p className="text-slate-300">
            Private galleries • Watermarked previews • Secure downloads
          </p>
        </div>
      </section>

      {/* ================= MAIN CARD ================= */}
      <section className="max-w-4xl mx-auto -mt-24 relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">

          {/* ===== CLIENT ===== */}
          {activeTab === "client" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Client Access</h3>

              {/* Gallery Code */}
              <form onSubmit={handleGalleryAccess} className="space-y-3">
                <input
                  placeholder="Gallery Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
                />
                <button className="w-full bg-amber-400 text-black py-2 rounded font-semibold">
                  Open Gallery
                </button>
              </form>

              <div className="text-center text-slate-500 text-sm">OR</div>

              {/* Client Login */}
              <form onSubmit={handleClientLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="Client Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
                />

                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-2.5 text-slate-400"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-amber-400 text-black py-2 rounded font-semibold"
                >
                  {loading ? "Logging in..." : "Client Login"}
                </button>
              </form>
            </div>
          )}

          {/* ===== ADMIN ===== */}
          {activeTab === "admin" && (
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-semibold">Admin Panel</h3>

              <button
                onClick={() => navigate("/admin/login")}
                className="w-full bg-indigo-600 py-2 rounded"
              >
                Admin Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="w-full border border-slate-600 py-2 rounded"
              >
                Admin Register
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-10 text-slate-500 text-sm">
        © {new Date().getFullYear()} Hemant Gogawale Studio
      </footer>
    </div>
  );
};

export default ClientLandingPage;
