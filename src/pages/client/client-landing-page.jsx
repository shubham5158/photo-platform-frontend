import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowRight, Zap, Shield } from "lucide-react";
import { toastError } from "../../utils/toast.jsx";

/**
 * ======================================================
 * CLIENT LANDING PAGE
 * ✔ FUNCTIONALITY UNCHANGED
 * ✔ ONLY UI / DESIGN UPDATED
 * ======================================================
 */

const ClientLandingPage = () => {
  const navigate = useNavigate();

  // 🔒 ORIGINAL STATE (UNCHANGED)
  const [galleryCode, setGalleryCode] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔒 ORIGINAL LOADING BEHAVIOUR
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // 🔒 ORIGINAL SUBMIT LOGIC (UNCHANGED)
  const handleSubmit = (e) => {
    e.preventDefault();

    const code = galleryCode.trim();
    if (!code) {
      toastError("Please enter your gallery code");
      return;
    }

    // 🔒 SAME ROUTE AS BEFORE
    navigate(`/g/${code}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center">
        <div className="text-neutral-400 text-sm">Loading gallery…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="text-amber-400" />
            <span className="font-semibold tracking-wide">
              Photo Platform
            </span>
          </div>

          {/* 🔒 ADMIN LOGIN LINK (UNCHANGED ROUTE) */}
          <button
            onClick={() => navigate("/admin/login")}
            className="text-sm text-neutral-300 hover:text-amber-400 transition"
          >
            Admin Login
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative flex items-center justify-center min-h-[85vh] px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0b0b0d]" />

        <div className="relative z-10 max-w-3xl w-full text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 text-amber-400 text-sm mb-6">
            <Zap size={16} />
            Private Client Gallery
          </span>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Access Your <span className="text-amber-400">Event Photos</span>
          </h1>

          <p className="text-neutral-300 text-lg mb-10">
            View watermarked previews, select your favorite photos,
            and securely download originals after confirmation.
          </p>

          {/* ================= FORM ================= */}
          {/* 🔒 SAME FORM LOGIC – ONLY DESIGN UPDATED */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-xl"
          >
            <label className="block text-left text-xs text-neutral-400 mb-2">
              Client Gallery Code
            </label>

            <input
              value={galleryCode}
              onChange={(e) => setGalleryCode(e.target.value)}
              placeholder="Enter your gallery code"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-amber-400 outline-none mb-4"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black font-semibold py-3 rounded-xl hover:bg-amber-300 transition"
            >
              Open My Gallery <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Why Clients Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Camera />}
            title="Professional Quality"
            desc="Captured using professional equipment with attention to detail."
          />
          <Feature
            icon={<Shield />}
            title="Secure Galleries"
            desc="Each gallery is private and protected with a unique code."
          />
          <Feature
            icon={<Zap />}
            title="Fast & Simple"
            desc="Quick preview, smooth checkout, and instant downloads."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Photo Platform. All rights reserved.
      </footer>
    </div>
  );
};

/* ================= FEATURE CARD ================= */
const Feature = ({ icon, title, desc }) => (
  <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 hover:border-amber-400/40 transition">
    <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-neutral-400">{desc}</p>
  </div>
);

export default ClientLandingPage;
