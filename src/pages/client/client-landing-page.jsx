import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";
import ClientLandingSkeleton from "../../components/ui/ClientLandingSkeleton.jsx";

const portfolioImages = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1521334884684-d80222895322",
  "https://images.unsplash.com/photo-1579758682665-53a1a614eea6",
];

const ClientLandingPage = () => {
  const navigate = useNavigate();

  /* -------------------- STATE -------------------- */
  const [galleryCode, setGalleryCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  /* -------------------- PAGE SKELETON -------------------- */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  /* -------------------- AUTO SLIDER -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % portfolioImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------- HANDLERS -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const code = galleryCode.trim();
    if (!code) {
      toastError("Please enter your gallery code");
      return;
    }
    navigate(`/g/${code}`);
  };

  /* -------------------- SKELETON -------------------- */
  if (loading) {
    return <ClientLandingSkeleton />;
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      {/* <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold tracking-wide">
            Hemant Gogawale Studio
          </h1>

          <div className="flex gap-4 text-sm">
            <button
              onClick={() => navigate("/admin/login")}
              className="text-amber-400 hover:underline"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-slate-300 hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </header> */}

      {/*  */}

      {/* ================= HERO ================= */}
      <section className="relative h-[75vh] flex items-center justify-center">
        <img
          src={portfolioImages[slide]}
          alt="Portfolio"
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-[2000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-slate-950/80 to-slate-950" />

        <div className="relative z-10 max-w-3xl text-center px-6 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Professional Sports & Wedding Photography
          </h2>

          <p className="text-slate-300 mb-8">
            Private client galleries • Secure downloads • Premium quality
          </p>

          {/* CLIENT ACCESS */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-slate-900/80 border border-slate-700 p-5 rounded-xl backdrop-blur"
          >
            <label className="block text-left text-xs text-slate-400 mb-1">
              Client Gallery Code
            </label>
            <input
              value={galleryCode}
              onChange={(e) => setGalleryCode(e.target.value)}
              placeholder="Enter your gallery code"
              className="w-full px-3 py-2 mb-3 rounded bg-slate-950 border border-slate-700 focus:ring-2 focus:ring-amber-400 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-amber-400 text-slate-900 font-semibold py-2 rounded hover:bg-amber-300 transition"
            >
              Open My Gallery
            </button>
          </form>
        </div>
      </section>

      {/* ================= FEATURED WORK ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-10">
          Featured Moments
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {portfolioImages.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl group"
            >
              <img
                src={src}
                alt=""
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-slate-900 border-t border-slate-800 py-16">
        <h3 className="text-2xl font-semibold text-center mb-10">
          What Clients Say
        </h3>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 px-6">
          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-xl">
            <p className="text-slate-300 text-sm">
              “Super smooth experience. Photos were stunning and easy to download.”
            </p>
            <p className="mt-3 text-amber-300 text-sm">— Rohit & Anjali</p>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-xl">
            <p className="text-slate-300 text-sm">
              “Professional work. Loved the private gallery system!”
            </p>
            <p className="mt-3 text-amber-300 text-sm">— Neha Sharma</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-8 text-slate-500 text-xs">
        © {new Date().getFullYear()} Hemant Gogawale Photography • All Rights Reserved
      </footer>
    </div>
  );
};

export default ClientLandingPage;
