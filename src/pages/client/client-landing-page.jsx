import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClientLandingPage = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1579758682665-53a1a614eea6",
    "https://images.unsplash.com/photo-1599058917212-d750089bc07d",
    "https://images.unsplash.com/photo-1594737625785-c4a35c8b90c4",
    "https://images.unsplash.com/photo-1571019613914-85f342c1d4b7",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-lg tracking-wider">
            POWER SPORTS STUDIO
          </h1>

          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <span className="hover:text-white cursor-pointer">Portfolio</span>
            <span className="hover:text-white cursor-pointer">Pricing</span>
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="px-4 py-2 text-xs font-semibold border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition rounded-md"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-xs font-semibold border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition rounded-md"
            >
              Admin Register
            </button>
            <button
              onClick={() => navigate("/client/login")}
              className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-md hover:bg-gray-200"
            >
              Client Login
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-screen flex items-center">
        <img
          src={heroImages[slide]}
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#020617]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-5xl font-extrabold leading-tight">
              ELITE SPORTS <br /> PHOTOGRAPHY
            </h2>
            <p className="text-gray-300 mt-4 max-w-md">
              Bodybuilding • Fitness • Action • Athlete Branding  
              Premium photography that sells power.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => document.getElementById("portfolio").scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 bg-amber-400 text-black font-semibold rounded-md hover:bg-amber-300"
              >
                View Portfolio
              </button>
              <button
                onClick={() => navigate("/client/login")}
                className="px-6 py-3 border border-white/30 rounded-md hover:bg-white/10"
              >
                Client Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold mb-10 text-center">
          Featured Sports Galleries
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "https://images.unsplash.com/photo-1579758682665-53a1a614eea6",
            "https://images.unsplash.com/photo-1594737625785-c4a35c8b90c4",
            "https://images.unsplash.com/photo-1571019613914-85f342c1d4b7",
          ].map((img, i) => (
            <div
              key={i}
              className="relative group overflow-hidden rounded-xl cursor-pointer"
              onClick={() => navigate("/client/login")}
            >
              <img
                src={img}
                alt=""
                className="h-80 w-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-5">
                <span className="text-sm text-gray-300">Bodybuilding</span>
                <span className="font-semibold">₹199 / Photo</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 text-center py-8 text-xs text-gray-400">
        © {new Date().getFullYear()} Power Sports Studio. All Rights Reserved.
      </footer>
    </div>
  );
};

export default ClientLandingPage;
