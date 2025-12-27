import React from 'react';
import { Camera, Zap, Shield, Award, ArrowRight, Instagram, Mail } from 'lucide-react';

// Button Component
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3 text-sm',
    lg: 'h-11 rounded-md px-8 text-base'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function HomePage() {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Camera className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">IronLens Photography</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#portfolio" onClick={(e) => scrollToSection(e, '#portfolio')} className="text-sm font-medium hover:text-primary transition-colors">
                Portfolio
              </a>
              <a href="#services" onClick={(e) => scrollToSection(e, '#services')} className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </a>
              <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="/client">
                <Button variant="outline" size="sm">
                  Client Access
                </Button>
              </a>
              <a href="/admin">
                <Button size="sm">Admin</Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Professional Sports Photography
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                Capturing <span className="text-primary">Power</span> & <span className="text-primary">Passion</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Elite bodybuilding and fitness photography that captures every ounce of dedication, strength, and
                triumph. From competition day to personal milestones, we immortalize your athletic journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/client">
                  <Button size="lg" className="gap-2">
                    View Your Gallery <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="#portfolio" onClick={(e) => scrollToSection(e, '#portfolio')}>
                  <Button size="lg" variant="outline">
                    Explore Portfolio
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Events Covered</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold">10k+</div>
                  <div className="text-sm text-muted-foreground">Athletes Photographed</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop"
                  alt="Bodybuilding Photography"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold">Award Winning</div>
                    <div className="text-sm text-muted-foreground">Photography</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Why Choose IronLens?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Professional photography services designed specifically for bodybuilding and fitness athletes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Equipment</h3>
              <p className="text-muted-foreground leading-relaxed">
                State-of-the-art cameras and lighting to capture every muscle detail and definition with stunning
                clarity.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse, select, and purchase your photos within 24 hours of your event. Fast turnaround guaranteed.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Gallery Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                Private galleries for each event with QR code access. Your photos are secure and easily accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Recent Work</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A glimpse into our portfolio of powerful athletic moments
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Mr. Olympia 2024", count: "1,250 photos", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=800&fit=crop" },
              { title: "Arnold Classic", count: "980 photos", image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=800&fit=crop" },
              { title: "Regional Championship", count: "750 photos", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=800&fit=crop" },
              { title: "NPC National Show", count: "1,100 photos", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop" },
              { title: "Local Pro Qualifier", count: "640 photos", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop" },
              { title: "Fitness Expo", count: "890 photos", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop" },
            ].map((item, index) => (
              <div key={index} className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Simple process from event to final photos
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Event Coverage", desc: "We photograph your competition or event" },
              { step: "02", title: "Gallery Created", desc: "Private gallery generated with QR code" },
              { step: "03", title: "Browse & Select", desc: "Review and favorite your best shots" },
              { step: "04", title: "Purchase & Download", desc: "Buy and instantly download as ZIP" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Access Your Photos?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Enter your event code or scan the QR code provided at your competition
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/client">
              <Button size="lg" className="gap-2">
                Client Gallery Access <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#about" onClick={(e) => scrollToSection(e, '#about')}>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                <span className="font-bold">IronLens</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional bodybuilding and fitness photography for athletes who demand excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#portfolio" onClick={(e) => scrollToSection(e, '#portfolio')} className="text-muted-foreground hover:text-primary">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => scrollToSection(e, '#services')} className="text-muted-foreground hover:text-primary">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/client" className="text-muted-foreground hover:text-primary">
                    Client Access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Photographers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/admin" className="text-muted-foreground hover:text-primary">
                    Admin Login
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Upload Photos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  info@ironlens.com
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Instagram className="h-4 w-4" />
                  @ironlens_photo
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 IronLens Photography. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        :root {
          --background: oklch(0.985 0 0);
          --foreground: oklch(0.145 0 0);
          --card: oklch(1 0 0);
          --card-foreground: oklch(0.145 0 0);
          --popover: oklch(1 0 0);
          --popover-foreground: oklch(0.145 0 0);
          --primary: oklch(0.65 0.22 35);
          --primary-foreground: oklch(1 0 0);
          --secondary: oklch(0.95 0 0);
          --secondary-foreground: oklch(0.145 0 0);
          --muted: oklch(0.96 0 0);
          --muted-foreground: oklch(0.52 0 0);
          --accent: oklch(0.96 0 0);
          --accent-foreground: oklch(0.145 0 0);
          --destructive: oklch(0.577 0.245 27.325);
          --destructive-foreground: oklch(1 0 0);
          --border: oklch(0.91 0 0);
          --input: oklch(0.91 0 0);
          --ring: oklch(0.65 0.22 35);
          --radius: 0.625rem;
        }

        .dark {
          --background: oklch(0.11 0 0);
          --foreground: oklch(0.985 0 0);
          --card: oklch(0.145 0 0);
          --card-foreground: oklch(0.985 0 0);
          --popover: oklch(0.145 0 0);
          --popover-foreground: oklch(0.985 0 0);
          --primary: oklch(0.7 0.22 35);
          --primary-foreground: oklch(0.11 0 0);
          --secondary: oklch(0.22 0 0);
          --secondary-foreground: oklch(0.985 0 0);
          --muted: oklch(0.22 0 0);
          --muted-foreground: oklch(0.65 0 0);
          --accent: oklch(0.22 0 0);
          --accent-foreground: oklch(0.985 0 0);
          --destructive: oklch(0.55 0.2 27);
          --destructive-foreground: oklch(0.985 0 0);
          --border: oklch(0.22 0 0);
          --input: oklch(0.22 0 0);
          --ring: oklch(0.7 0.22 35);
        }

        .bg-background { background-color: var(--background); }
        .text-foreground { color: var(--foreground); }
        .bg-card { background-color: var(--card); }
        .text-card-foreground { color: var(--card-foreground); }
        .bg-primary { background-color: var(--primary); }
        .text-primary { color: var(--primary); }
        .text-primary-foreground { color: var(--primary-foreground); }
        .bg-secondary { background-color: var(--secondary); }
        .text-secondary-foreground { color: var(--secondary-foreground); }
        .bg-muted { background-color: var(--muted); }
        .text-muted-foreground { color: var(--muted-foreground); }
        .bg-accent { background-color: var(--accent); }
        .text-accent-foreground { color: var(--accent-foreground); }
        .border-border { border-color: var(--border); }
        .ring { box-shadow: 0 0 0 2px var(--ring); }

        .backdrop-blur-lg { backdrop-filter: blur(16px); }
        .text-balance { text-wrap: balance; }
        .text-pretty { text-wrap: pretty; }
      `}</style>
    </div>
  );
}