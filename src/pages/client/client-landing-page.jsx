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
import Button from "@/components/ui/Button";

const HomePage = () => {
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-7 w-7 text-primary" />
            <span className="font-bold text-lg">IronLens Photography</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a onClick={(e) => scrollTo(e, "#portfolio")} href="#portfolio" className="text-sm hover:text-primary">
              Portfolio
            </a>
            <a onClick={(e) => scrollTo(e, "#services")} href="#services" className="text-sm hover:text-primary">
              Services
            </a>
            <a onClick={(e) => scrollTo(e, "#about")} href="#about" className="text-sm hover:text-primary">
              About
            </a>
            <Button variant="outline" size="sm">Client Access</Button>
            <Button size="sm">Admin</Button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              Professional Sports Photography
            </span>

            <h1 className="text-5xl lg:text-7xl font-bold">
              Capturing <span className="text-primary">Power</span> &{" "}
              <span className="text-primary">Passion</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
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
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800"
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
          <h2 className="text-4xl font-bold mb-4">Why Choose IronLens?</h2>
          <p className="text-muted-foreground mb-12">
            Built specifically for bodybuilding & fitness events
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              [Camera, "Professional Equipment", "High-end gear for perfect muscle definition."],
              [Zap, "Fast Delivery", "Browse & buy photos within 24 hours."],
              [Shield, "Secure Access", "QR-based private galleries."],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition">
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

      {/* ================= CTA ================= */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Access Your Photos?</h2>
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
              <span className="font-bold">IronLens</span>
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
              <li>Client Access</li>
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
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@ironlens.com
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> @ironlens_photo
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          © 2025 IronLens Photography
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
