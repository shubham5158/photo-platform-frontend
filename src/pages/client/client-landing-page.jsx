"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toastError } from "../../utils/toast.jsx"
import ClientLandingSkeleton from "../../components/ui/ClientLandingSkeleton.jsx"
import { Dumbbell, Zap, Shield, Award, ArrowRight, Instagram, Mail, ChevronRight } from "lucide-react"

const portfolioImages = [
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069",
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
]

const ClientLandingPage = () => {
  const navigate = useNavigate()

  /* -------------------- STATE -------------------- */
  const [galleryCode, setGalleryCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)

  /* -------------------- PAGE SKELETON -------------------- */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  /* -------------------- AUTO SLIDER -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % portfolioImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  /* -------------------- HANDLERS -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault()
    const code = galleryCode.trim()
    if (!code) {
      toastError("Please enter your gallery code")
      return
    }
    navigate(`/g/${code}`)
  }

  /* -------------------- SKELETON -------------------- */
  if (loading) {
    return <ClientLandingSkeleton />
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-black">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Dumbbell className="h-10 w-10 text-accent" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-accent/20 blur-xl" />
              </div>
              <div>
                <span className="block text-2xl font-black tracking-tighter text-white uppercase">Iron Lens</span>
                <span className="block text-[10px] font-bold tracking-widest text-accent uppercase">
                  Sports Photography
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#portfolio"
                className="text-sm font-bold tracking-wide text-white/70 hover:text-accent transition-colors uppercase"
              >
                Gallery
              </a>
              <a
                href="#services"
                className="text-sm font-bold tracking-wide text-white/70 hover:text-accent transition-colors uppercase"
              >
                Services
              </a>
              <a
                href="#athletes"
                className="text-sm font-bold tracking-wide text-white/70 hover:text-accent transition-colors uppercase"
              >
                Athletes
              </a>
              <button
                onClick={() => navigate("/admin/login")}
                className="px-5 py-2.5 bg-accent/10 border-2 border-accent text-accent font-black text-sm uppercase tracking-wide hover:bg-accent hover:text-black transition-all"
              >
                Client Access
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="px-5 py-2.5 bg-accent text-black font-black text-sm uppercase tracking-wide hover:bg-accent/90 transition-all"
              >
                Admin
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          <img
            src={portfolioImages[slide] || "/placeholder.svg"}
            alt="Bodybuilding Photography"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] scale-105"
          />
          {/* Dramatic overlay with grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,68,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,68,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-sm backdrop-blur-sm">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-xs font-black tracking-widest text-accent uppercase">Elite Sports Photography</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white leading-[0.9] uppercase">
            Capture The
            <span className="block text-accent mt-2">Power</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 font-bold tracking-wide max-w-2xl mx-auto">
            Professional bodybuilding & fitness photography • Secure client galleries • Championship quality
          </p>

          {/* CLIENT ACCESS FORM */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="bg-black/80 border-2 border-accent/30 p-8 backdrop-blur-lg">
              <label className="block text-left text-xs text-accent mb-3 font-black tracking-widest uppercase">
                Access Your Gallery
              </label>
              <div className="flex gap-3">
                <input
                  value={galleryCode}
                  onChange={(e) => setGalleryCode(e.target.value)}
                  placeholder="ENTER YOUR CODE"
                  className="flex-1 px-5 py-4 bg-black border-2 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent focus:border-accent outline-none font-bold tracking-wider uppercase text-sm"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-accent text-black font-black tracking-wider hover:bg-accent/90 transition-all uppercase flex items-center gap-2 group"
                >
                  Enter
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="border-l-4 border-accent pl-4">
              <div className="text-4xl font-black text-white">500+</div>
              <div className="text-sm text-white/60 font-bold tracking-wide uppercase">Athletes</div>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <div className="text-4xl font-black text-white">50K+</div>
              <div className="text-sm text-white/60 font-bold tracking-wide uppercase">Photos</div>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <div className="text-4xl font-black text-white">100+</div>
              <div className="text-sm text-white/60 font-bold tracking-wide uppercase">Events</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED WORK ================= */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="text-sm font-black tracking-widest text-accent uppercase border-b-2 border-accent pb-2">
              Portfolio
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4">
            Hall of Champions
          </h2>
          <p className="text-xl text-white/60 font-bold">Peak performance captured in perfect detail</p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioImages.map((src, i) => (
            <div key={i} className="relative overflow-hidden group cursor-pointer aspect-[3/4]">
              <img
                src={src || "/placeholder.svg"}
                alt={`Bodybuilding photography ${i + 1}`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              {/* Overlay with accent border */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent transition-all" />

              {/* Hover Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="text-sm font-black tracking-widest text-accent uppercase mb-1">Competition {i + 1}</div>
                <div className="text-lg font-bold text-white">Championship Series</div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-10 py-4 border-2 border-accent text-accent font-black tracking-widest uppercase hover:bg-accent hover:text-black transition-all inline-flex items-center gap-3 group">
            View Full Gallery
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="relative py-32 bg-gradient-to-b from-black via-accent/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-black tracking-widest text-accent uppercase border-b-2 border-accent pb-2 inline-block mb-4">
              Services
            </span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase">What We Deliver</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-black border-2 border-white/10 p-8 hover:border-accent transition-all group">
              <div className="mb-6 relative inline-block">
                <Shield className="h-12 w-12 text-accent" strokeWidth={2} />
                <div className="absolute inset-0 bg-accent/20 blur-xl" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Competition Coverage</h3>
              <p className="text-white/60 font-medium leading-relaxed">
                Full event photography from backstage prep to final poses. Every muscle, every moment captured in
                stunning detail.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-black border-2 border-white/10 p-8 hover:border-accent transition-all group">
              <div className="mb-6 relative inline-block">
                <Award className="h-12 w-12 text-accent" strokeWidth={2} />
                <div className="absolute inset-0 bg-accent/20 blur-xl" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Private Sessions</h3>
              <p className="text-white/60 font-medium leading-relaxed">
                Professional studio shoots for portfolios, sponsorships, and social media. Lighting that brings out
                every definition.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-black border-2 border-white/10 p-8 hover:border-accent transition-all group">
              <div className="mb-6 relative inline-block">
                <Zap className="h-12 w-12 text-accent" strokeWidth={2} />
                <div className="absolute inset-0 bg-accent/20 blur-xl" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Instant Delivery</h3>
              <p className="text-white/60 font-medium leading-relaxed">
                Secure online galleries with high-resolution downloads. Access your photos anywhere, download unlimited
                times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-32 bg-black border-y-2 border-accent/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-black tracking-widest text-accent uppercase border-b-2 border-accent pb-2 inline-block mb-4">
              Testimonials
            </span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase">Athlete Voices</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30 p-8 relative overflow-hidden group hover:border-accent transition-all">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
              <div className="text-6xl text-accent/20 font-black mb-4">"</div>
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-6">
                These shots are absolutely insane! Every muscle fiber visible, perfect lighting. Used them for my
                sponsorship deal.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-black font-black text-xl">RK</span>
                </div>
                <div>
                  <p className="text-accent font-black text-lg uppercase tracking-wide">Rohan Kumar</p>
                  <p className="text-white/50 text-sm font-bold">Mr. India Finalist 2024</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30 p-8 relative overflow-hidden group hover:border-accent transition-all">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
              <div className="text-6xl text-accent/20 font-black mb-4">"</div>
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-6">
                Professional service from start to finish. Gallery was ready same day. Quality is unmatched in the
                industry.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-black font-black text-xl">PS</span>
                </div>
                <div>
                  <p className="text-accent font-black text-lg uppercase tracking-wide">Priya Sharma</p>
                  <p className="text-white/50 text-sm font-bold">IFBB Pro Athlete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-32 bg-gradient-to-b from-black via-accent/5 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,68,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,68,0,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-6 leading-[0.9]">
            Ready To Look
            <span className="block text-accent mt-2">Legendary?</span>
          </h2>
          <p className="text-xl text-white/70 font-bold mb-12 max-w-2xl mx-auto">
            Book your session today and get photos that match your dedication
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="px-12 py-5 bg-accent text-black font-black text-lg tracking-widest uppercase hover:bg-accent/90 transition-all flex items-center gap-3 group">
              Book A Session
              <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-12 py-5 border-2 border-accent text-accent font-black text-lg tracking-widest uppercase hover:bg-accent hover:text-black transition-all">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t-2 border-accent/20 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Dumbbell className="h-8 w-8 text-accent" strokeWidth={2.5} />
                <span className="text-xl font-black tracking-tighter text-white uppercase">Iron Lens</span>
              </div>
              <p className="text-white/60 font-medium text-sm leading-relaxed">
                Capturing the strength, dedication, and artistry of bodybuilding athletes worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-accent font-black tracking-widest uppercase text-sm mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#portfolio"
                  className="block text-white/60 hover:text-accent font-bold text-sm transition-colors"
                >
                  Portfolio
                </a>
                <a
                  href="#services"
                  className="block text-white/60 hover:text-accent font-bold text-sm transition-colors"
                >
                  Services
                </a>
                <button
                  onClick={() => navigate("/admin/login")}
                  className="block text-white/60 hover:text-accent font-bold text-sm transition-colors text-left"
                >
                  Client Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="block text-white/60 hover:text-accent font-bold text-sm transition-colors text-left"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-accent font-black tracking-widest uppercase text-sm mb-4">Connect</h4>
              <div className="space-y-3">
                <a
                  href="mailto:contact@ironlens.com"
                  className="flex items-center gap-3 text-white/60 hover:text-accent font-bold text-sm transition-colors group"
                >
                  <Mail className="h-5 w-5" />
                  <span>contact@ironlens.com</span>
                </a>
                <a
                  href="https://instagram.com"
                  className="flex items-center gap-3 text-white/60 hover:text-accent font-bold text-sm transition-colors group"
                >
                  <Instagram className="h-5 w-5" />
                  <span>@ironlens_photography</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm font-bold tracking-wide">
              © {new Date().getFullYear()} Iron Lens Photography • All Rights Reserved • Capturing Greatness Since 2020
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ClientLandingPage