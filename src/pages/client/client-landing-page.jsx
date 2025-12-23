// src/pages/client/client-landing-page.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";
import {
  Camera,
  User,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const ClientLandingPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const portfolioImages = [
    "https://images.unsplash.com/photo-1579758682665-53a1a614eea6",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toastError("Enter your gallery code");
      return;
    }
    navigate(`/g/${code.trim()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur bg-black/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="text-amber-400" />
            <span className="text-xl font-bold tracking-wide">
              Hemant Gogawale Studio
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
            >
              <ShieldCheck size={16} />
              Admin Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 border border-amber-400 text-amber-400 rounded-lg text-sm hover:bg-amber-400 hover:text-black transition"
            >
              Admin Register
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black to-black"></div>

        <div className="relative text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            PREMIUM SPORTS PHOTOGRAPHY
          </h1>
          <p className="text-slate-300 mb-8">
            Bodybuilding • Fitness • Competition • Personal Branding
          </p>

          {/* CLIENT ACCESS */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 max-w-md mx-auto"
          >
            <label className="block text-sm text-slate-400 mb-2">
              Client Gallery Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter gallery code"
              className="w-full px-3 py-2 bg-black border border-slate-700 rounded text-sm focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="mt-4 w-full flex justify-center items-center gap-2 bg-amber-400 text-black py-2 rounded font-semibold"
            >
              Open Gallery <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* ================= PORTFOLIO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Work
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {portfolioImages.map((img, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl border border-slate-800"
            >
              <img
                src={img}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="bg-slate-950 border-t border-slate-800 py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <Camera className="mx-auto text-amber-400 mb-3" />
            <h3 className="font-semibold mb-2">Elite Quality</h3>
            <p className="text-sm text-slate-400">
              Studio-grade sports photography with cinematic lighting.
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <User className="mx-auto text-amber-400 mb-3" />
            <h3 className="font-semibold mb-2">Client-First Delivery</h3>
            <p className="text-sm text-slate-400">
              Private galleries with instant access & downloads.
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <ShieldCheck className="mx-auto text-amber-400 mb-3" />
            <h3 className="font-semibold mb-2">Secure & Trusted</h3>
            <p className="text-sm text-slate-400">
              Secure payments, watermarking & controlled downloads.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} Hemant Gogawale Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default ClientLandingPage;
