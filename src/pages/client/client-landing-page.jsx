// src/pages/client/client-landing-page.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";
import { Moon, Sun } from "lucide-react";

const ClientLandingPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Auto-sliding portfolio
  const portfolioImages = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "https://images.unsplash.com/photo-1521334884684-d80222895322",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  ];

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % portfolioImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      toastError("Please enter your gallery code");
      return;
    }
    navigate(`/g/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-900 text-slate-50 transition-colors duration-500">
      {/* HEADER WITH BRANDING */}
      <header className="flex justify-between items-center px-6 py-4 backdrop-blur-md bg-black/20 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Brand Logo"
            className="h-10 w-10 rounded-full shadow-md"
          />
          <h1 className="text-lg font-semibold tracking-wide">
            Hemant Gogawale Studio
          </h1>
        </div>
      </header>

      {/* HERO SECTION WITH ANIMATION */}
      <div className="relative h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        <img
          src={portfolioImages[slide]}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-[2000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-950/80 to-slate-950"></div>

        <div className="relative text-center max-w-3xl animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Your Beautiful Memories Delivered With Love
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto fadeIn">
            Wedding • Pre-Wedding • Engagement • Baby Shoot • Events — Access
            your private gallery instantly using your unique code.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => navigate("/admin/login")}
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
            >
              <span className="relative z-10">Admin Login</span>
              <div className="absolute inset-0 bg-linear-to-r from-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onClick={() => navigate("/register")}
              className="group px-8 py-3.5 rounded-full border-2 border-slate-600 text-sm font-semibold hover:border-amber-400/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10">Admin Register</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 to-amber-400/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>

      {/* GALLERY CODE BOX */}
      <div className="max-w-4xl mx-auto px-4 -mt-15 relative z-20">
        <div className="bg-slate-900/80 dark:bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-fadeIn">
          <h2 className="text-xl font-semibold mb-2">Client Access</h2>
          <p className="text-sm text-slate-300 mb-4">
            Enter the gallery code shared with you to view your photos.
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Gallery Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 4f9a21c3"
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm text-slate-100 
                focus:outline-none focus:ring-2 focus:ring-amber-400/70"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300"
            >
              Open My Gallery
            </button>
          </form>
        </div>
      </div>

      {/* AUTO-SLIDING PORTFOLIO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Featured Work
        </h3>

        <div className="relative overflow-hidden rounded-xl h-64 md:h-80 lg:h-96">
          <div
            className="whitespace-nowrap transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {portfolioImages.map((img, i) => (
              <div key={i} className="inline-block w-full h-full">
                <img
                  src={img}
                  className="w-full h-full object-cover rounded-xl"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 animate-[fadeInUp_1s_ease-out_0.6s_both]">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Featured Moments
          </h3>
          <p className="text-slate-400">A glimpse into our recent work</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            "https://images.unsplash.com/photo-1521334884684-d80222895322",
            "https://plus.unsplash.com/premium_photo-1661575380608-7911e49bb55c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGJvZHlidWlsZGVyfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1579758682665-53a1a614eea6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          ].map((src, idx) => (
            <div 
              key={idx}
              className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <img
                src={src}
                alt={`Portfolio ${idx + 1}`}
                className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-8 h-1 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-slate-900 py-16 px-4 dark:bg-slate-800">
        <h3 className="text-2xl font-semibold text-center mb-8">
          What Clients Say
        </h3>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 animate-fadeInUp">
            <p className="text-slate-300 text-sm">
              “Absolutely stunning photos! Download link worked perfectly.”
            </p>
            <div className="mt-3 text-sm text-amber-300">— Priya & Rohan</div>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 animate-fadeInUp delay-150">
            <p className="text-slate-300 text-sm">
              “Super easy experience. Our full wedding gallery was delivered
              beautifully!”
            </p>
            <div className="mt-3 text-sm text-amber-300">— Neha Sharma</div>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-500 text-xs">
        © {new Date().getFullYear()} Shubham Wedding Studio — All Rights
        Reserved.
      </footer>
    </div>
  );
};

export default ClientLandingPage;
