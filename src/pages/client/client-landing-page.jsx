import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";
import { Trophy, Dumbbell, Camera, Lock, User, ShoppingCart } from "lucide-react";

const ClientLandingPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("client"); // client, login, register

  // Portfolio Slider State
  const portfolioImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470", // Gym/Bodybuilding
    "https://images.unsplash.com/photo-1583454110551-21f2fa20019b?q=80&w=1470", // Weights
    "https://images.unsplash.com/photo-1574673001865-4a92801438d1?q=80&w=1470", // Action
  ];

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % portfolioImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toastError("Please enter your access code");
      return;
    }
    navigate(`/g/${code.trim()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500 selection:text-black">
      
      {/* NAVIGATION BAR */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-1.5 rounded-sm">
            <Camera size={24} className="text-black" />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            Gogawale <span className="text-amber-500">Sports</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
          <a href="#work" className="hover:text-amber-500 transition">Portfolio</a>
          <a href="#services" className="hover:text-amber-500 transition">Print Store</a>
          <a href="#testimonials" className="hover:text-amber-500 transition">Reviews</a>
        </div>
      </header>

      {/* HERO HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={portfolioImages[slide]}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-[3000ms] brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>

        <div className="relative z-10 text-center px-6">
          <span className="inline-block px-4 py-1 mb-4 border border-amber-500/50 rounded-full text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold bg-amber-500/10">
            Professional Sports Photography
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-none mb-6">
            Capture Your <br />
            <span className="text-transparent stroke-text">Greatness</span>
          </h1>
          
          {/* ACCESS TABS CONTAINER */}
          <div className="max-w-md mx-auto mt-12 bg-zinc-900/90 border border-white/10 p-1 rounded-xl backdrop-blur-md shadow-2xl">
            <div className="flex mb-6">
              <button 
                onClick={() => setActiveTab("client")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition ${activeTab === "client" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}
              >
                Access Gallery
              </button>
              <button 
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition ${activeTab === "login" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}
              >
                Admin Login
              </button>
              <button 
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition ${activeTab === "register" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}
              >
                Join Team
              </button>
            </div>

            <div className="px-6 pb-6">
              {activeTab === "client" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="text-[10px] uppercase text-zinc-500 font-bold mb-2 block">Personal Access Code</label>
                    <input 
                      type="text" 
                      placeholder="ENTER CODE (E.G. ATHLETE-2024)"
                      className="w-full bg-black border border-zinc-800 p-4 text-sm font-mono focus:border-amber-500 outline-none transition"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <button className="w-full bg-white text-black font-black py-4 uppercase text-sm hover:bg-amber-500 transition duration-300">
                    View My Photos
                  </button>
                </form>
              )}

              {activeTab === "login" && (
                <div className="text-center py-4">
                  <p className="text-zinc-400 text-sm mb-6 uppercase tracking-tighter">Authorized Photographer Access Only</p>
                  <button 
                    onClick={() => navigate("/admin/login")}
                    className="w-full bg-amber-500 text-black font-black py-4 uppercase text-sm flex items-center justify-center gap-2"
                  >
                    <Lock size={16} /> Enter Control Panel
                  </button>
                </div>
              )}

              {activeTab === "register" && (
                <div className="text-center py-4">
                  <p className="text-zinc-400 text-sm mb-6 uppercase tracking-tighter">Start selling your sports photography</p>
                  <button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-white text-black font-black py-4 uppercase text-sm flex items-center justify-center gap-2"
                  >
                    <User size={16} /> Create Creator Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK - BOLD GRID */}
      <section id="work" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black uppercase italic leading-tight">Elite <br/>Portfolio</h2>
            <div className="h-1 w-20 bg-amber-500 mt-2"></div>
          </div>
          <p className="max-w-xs text-zinc-500 text-sm uppercase font-semibold">
            High-contrast, high-performance visual storytelling for athletes and federations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {[
            "https://images.unsplash.com/photo-1574673001865-4a92801438d1",
            "https://images.unsplash.com/photo-1583454110551-21f2fa20019b",
            "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5",
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
          ].map((img, i) => (
            <div key={i} className={`relative group overflow-hidden ${i === 0 || i === 3 ? 'md:col-span-2' : ''} h-80`}>
              <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="Sport" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
            </div>
          ))}
        </div>
      </section>

      {/* E-COMMERCE UPSELL SECTION */}
      <section className="bg-zinc-900 py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <Trophy className="text-amber-500 mb-4" size={40} />
            <h4 className="font-black uppercase mb-2">High-Res Digital</h4>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Instant downloads for your social media and sponsors.</p>
          </div>
          <div className="flex flex-col items-center text-center border-x border-white/10 px-6">
            <ShoppingCart className="text-amber-500 mb-4" size={40} />
            <h4 className="font-black uppercase mb-2">Print Store</h4>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Premium metallic prints and canvases for your home gym.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Dumbbell className="text-amber-500 mb-4" size={40} />
            <h4 className="font-black uppercase mb-2">Event Coverage</h4>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">On-stage and backstage coverage for bodybuilding shows.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Hemant Gogawale • Peak Performance Imagery
        </p>
      </footer>

      {/* CSS for Outline Text */}
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px white;
        }
      `}</style>
    </div>
  );
};

export default ClientLandingPage;