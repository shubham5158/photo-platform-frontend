import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Zap, Shield, ArrowRight } from "lucide-react";
import { toastError } from "../../utils/toast.jsx";
import ClientLandingSkeleton from "../../components/ui/ClientLandingSkeleton.jsx";

const portfolioImages = [
  "https://images.unsplash.com/photo-1579758682665-53a1a614eea6",
  "https://images.unsplash.com/photo-1521334884684-d80222895322",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
];

const ClientLandingPage = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [galleryCode, setGalleryCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  /* ---------------- SKELETON ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- AUTO SLIDER ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => (s + 1) % portfolioImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- HANDLER ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const code = galleryCode.trim();
    if (!code) {
      toastError("Please enter your gallery code");
      return;
    }
    navigate(`/g/${code}`); // 🔒 SAME LOGIC (unchanged)
  };

  if (loading) return <ClientLandingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white overflow-hidden">
      {/* ================= NAV ================= */}
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="text-amber-400" />
            <span className="font-semibold tracking-wide">
              Hemant Gogawale Studio
            </span>
          </div>

          <button
            onClick={() => navigate("/admin/login")}
            className="text-sm text-neutral-300 hover:text-amber-400 transition"
          >
            Admin Login
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <img
          src={portfolioImages[slide]}
          alt="Photography"
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-[2000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0b0b0d]" />

        <div className="relative z-10 max-w-4xl text-center px-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 text-amber-400 text-sm mb-6">
            <Zap size={16} />
            Private Client Gallery
          </span>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Access Your <span className="text-amber-400">Event Photos</span>
          </h1>

          <p className="text-neutral-300 max-w-2xl mx-auto mb-10 text-lg">
            Secure private galleries with watermark previews and instant
            full-resolution downloads after confirmation.
          </p>

          {/* ===== GALLERY CODE FORM (UNCHANGED LOGIC) ===== */}
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
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Why Clients Love Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Camera />}
            title="Professional Quality"
            desc="Captured using high-end equipment with cinematic lighting."
          />
          <Feature
            icon={<Shield />}
            title="Secure Access"
            desc="Private galleries protected with unique event codes."
          />
          <Feature
            icon={<Zap />}
            title="Fast Delivery"
            desc="Instant preview, quick checkout, and original downloads."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Hemant Gogawale Photography. All rights
        reserved.
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
