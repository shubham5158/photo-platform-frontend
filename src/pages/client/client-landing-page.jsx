import React from "react";
import {
  Camera,
  Zap,
  Shield,
  Award,
  ArrowRight,
  Instagram,
  Mail,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Camera className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">
                Hemant Gogawale Photography
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#portfolio"
                onClick={(e) => scrollTo(e, "#portfolio")}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Portfolio
              </a>
              <a
                href="#services"
                onClick={(e) => scrollTo(e, "#services")}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={(e) => scrollTo(e, "#services")}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                About
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/login")}
              >
                Client Access
              </Button>
              <Button size="sm" onClick={() => navigate("/admin/login")}>
                Admin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              Professional Sports Photography
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              Capturing <span className="text-primary">Power</span> &{" "}
              <span className="text-primary">Passion</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Elite bodybuilding and fitness photography that captures strength,
              dedication, and victory — frame by frame.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Button size="lg" className="gap-2">
                View Gallery <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Explore Portfolio
              </Button>
            </div>

            <div className="flex gap-10 pt-4">
              {[
                ["500+", "Events"],
                ["10k+", "Athletes"],
                ["98%", "Satisfaction"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-bold">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1754475205146-23ca0cd6e73f?q=80&w=627&auto=format&fit=crop"
                alt="Photography"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <Award className="h-7 w-7 text-primary" />
                <div>
                  <p className="font-bold">Award Winning</p>
                  <p className="text-sm text-muted-foreground">Photography</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="py-20 bg-muted/30 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Hemant Gogawale Photography?
          </h2>
          <p className="text-muted-foreground mb-12">
            Built specifically for bodybuilding & fitness events
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              [
                Camera,
                "Professional Equipment",
                "High-end gear for perfect muscle definition.",
              ],
              [Zap, "Fast Delivery", "Browse & buy photos within 24 hours."],
              [Shield, "Secure Access", "QR-based private galleries."],
            ].map(([Icon, title, desc]) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PORTFOLIO ================= */}
      <section id="portfolio" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recent Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A glimpse into our portfolio of powerful athletic moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Mr. Olympia 2024",
                count: "1,250 photos",
                image:
                  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600",
              },
              {
                title: "Arnold Classic",
                count: "980 photos",
                image:
                  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600",
              },
              {
                title: "Regional Championship",
                count: "750 photos",
                image:
                  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600",
              },
              {
                title: "NPC National Show",
                count: "1,100 photos",
                image:
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
              },
              {
                title: "Local Pro Qualifier",
                count: "640 photos",
                image:
                  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
              },
              {
                title: "Fitness Expo",
                count: "890 photos",
                image:
                  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative aspect-3/4 rounded-xl overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground mb-12">
            Simple process from event to final photos
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              [
                "01",
                "Event Coverage",
                "We photograph your competition or event",
              ],
              [
                "02",
                "Gallery Created",
                "Private gallery generated with QR code",
              ],
              ["03", "Browse & Select", "Review and favorite your best shots"],
              [
                "04",
                "Purchase & Download",
                "Buy and instantly download as ZIP",
              ],
            ].map(([step, title, desc]) => (
              <div key={step}>
                <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step}
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Access Your Photos?
        </h2>
        <p className="text-muted-foreground mb-8">
          Scan your QR code or enter event access code
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Client Access <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-bold">Hemant Gogawale Photography</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional bodybuilding photography platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>Portfolio</li>
              <li>Services</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Admin</h4>
            <ul className="space-y-2 text-sm">
              <li>Admin Login</li>
              <li>Upload Photos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> info@ironlens.com
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Instagram className="h-4 w-4" /> @ironlens_photo
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          © 2025 Hemant gogawale Photography
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
