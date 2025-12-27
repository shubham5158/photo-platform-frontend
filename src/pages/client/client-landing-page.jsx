"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Dumbbell, Trophy, Star, ArrowRight, Users, ImageIcon } from "lucide-react";

const portfolioImages = [
  "/powerful-bodybuilder-posing-dramatic-lighting.jpg",
  "/bodybuilder-posing-stage.jpg",
  "/fitness-athlete-competition.jpg",
  "/bodybuilding-backstage-pump.jpg",
  "/muscular-athlete-flexing.jpg",
  "/bodybuilder-competition-pose.jpg",
];

export default function ClientLandingPage() {
  const router = useRouter();

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
  const handleSubmit = () => {
    e.preventDefault();
    const code = galleryCode.trim();
    if (!code) {
      alert("Please enter your gallery code");
      return;
    }
    router.push(`/client?code=${code}`);
  };

  /* -------------------- SKELETON -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">
              PowerFrame Studio
            </h1>
          </div>

          <div className="flex gap-4 text-sm">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/admin")}
              className="text-primary hover:text-primary/80"
            >
              Admin Login
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {portfolioImages.map((src, i) => (
            <img
              key={i}
              src={src || "/placeholder.svg"}
              alt="Portfolio"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
                i === slide ? "opacity-30" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Professional Bodybuilding & Sports Photography
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-balance">
            Capture Your
            <span className="text-primary block mt-2">Peak Performance</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
            Elite competition photography that showcases the power, dedication, and artistry of bodybuilding athletes
          </p>

          {/* Stats Banner */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Athletes Captured</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Competitions</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Photos Delivered</div>
            </div>
          </div>

          {/* CLIENT ACCESS FORM */}
          <div className="max-w-lg mx-auto">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Access Your Gallery</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Enter your unique gallery code to view and download your competition photos
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    value={galleryCode}
                    onChange={(e) => setGalleryCode(e.target.value)}
                    placeholder="Enter gallery code (e.g., ABC123)"
                    className="h-12 text-base bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                >
                  Open My Gallery
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Code sent via email after your event
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Elite Photography for Elite Athletes
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized in capturing the intensity, muscularity, and stage presence that defines championship bodybuilding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Competition Expertise</h4>
              <p className="text-muted-foreground">
                Professional coverage of stage presentations, backstage prep, and award ceremonies with perfect lighting and angles
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">High-Speed Capture</h4>
              <p className="text-muted-foreground">
                Advanced equipment capturing every pose transition, muscle detail, and defining moment in crystal-clear quality
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Private Galleries</h4>
              <p className="text-muted-foreground">
                Secure, personalized galleries for each athlete with instant access, easy selection, and quick digital downloads
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED WORK ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Championship Moments
          </h3>
          <p className="text-muted-foreground">
            Showcasing the dedication and artistry of competitive bodybuilding
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {portfolioImages.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl group aspect-[3/4] bg-muted"
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Competition photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-semibold text-white">Stage Presentation</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Process, Amazing Results
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Compete</h4>
              <p className="text-sm text-muted-foreground">
                Focus on your performance while we capture every moment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Receive Code</h4>

              <p className="text-sm text-muted-foreground">
                Get your unique gallery code via email after the event
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Access & Download</h4>
              <p className="text-sm text-muted-foreground">
                Enter your code to view, select, and download your photos
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}