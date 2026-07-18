import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Building2, Handshake, ArrowRight, ShieldAlert, BadgeAlert } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: RoleSelection,
});

function RoleSelection() {
  const navigate = useNavigate();

  const handleGuestMode = () => {
    toast.success("Welcome! Entering Demo Mode as a Farmer...", {
      description: "You are logged in as Rajesh Patil (Demo Account)",
    });
    setTimeout(() => {
      navigate({ to: "/farmer" });
    }, 1200);
  };

  const cards = [
    {
      title: "Farmer",
      emoji: "🌾",
      Icon: Sprout,
      desc: "Access real-time crop advisory, check live regional mandi prices, check subsidy eligibility, and apply for crop insurance.",
      color: "green",
      bgClass: "bg-tile-green hover:border-tile-green-icon",
      iconClass: "text-tile-green-icon bg-white",
      buttonText: "Role Details & Login",
      to: "/login/farmer",
    },
    {
      title: "NGO / FPO / operator",
      emoji: "🏢",
      Icon: Building2,
      desc: "Deploy agricultural assistance, register local farmers, upload regional land registry extract details, and manage DBT disbursements.",
      color: "blue",
      bgClass: "bg-tile-blue hover:border-tile-blue-icon",
      iconClass: "text-tile-blue-icon bg-white",
      buttonText: "Role Details & Login",
      to: "/login/operator",
    },
    {
      title: "Buyer / Trader",
      emoji: "🤝",
      Icon: Handshake,
      desc: "Browse verified crop listings, inspect digital soil/harvest certificates, connect directly with FPOs, and secure bulk orders.",
      color: "amber",
      bgClass: "bg-tile-amber hover:border-tile-amber-icon",
      iconClass: "text-tile-amber-icon bg-white",
      buttonText: "Role Details & Login",
      to: "/login/buyer",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Container */}
      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-10">
        
        {/* Branding Headers */}
        <header className="text-center animate-fade-in flex flex-col items-center gap-4">
          <div className="size-20 rounded-3xl bg-white border border-border flex items-center justify-center shadow-md overflow-hidden p-2 transition-transform hover:scale-105 duration-300">
            <img src={logoImg} alt="AgriSphere AI Emblem" className="size-full object-contain" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-primary">AgriSphere</span>{" "}
              <span className="text-[oklch(0.35_0.15_255)]">AI</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto leading-relaxed">
              Unified Agricultural & DBT Financial Ecosystem. Empowering farmers, operators, and trading markets with AI-driven operations.
            </p>
          </div>
        </header>

        {/* Heading */}
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
            Choose Your Role
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Please select your appropriate user workspace context to continue
          </p>
        </div>

        {/* Roles Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl animate-slide-up">
          {cards.map((c, idx) => {
            const Icon = c.Icon;
            return (
              <div
                key={idx}
                className={`group relative rounded-3xl p-6 flex flex-col justify-between border border-transparent shadow-sm hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1.5`}
              >
                {/* Visual Accent Layer */}
                <div className={`absolute inset-x-0 top-0 h-2 rounded-t-3xl ${
                  c.color === "green" ? "bg-primary" : c.color === "blue" ? "bg-tile-blue-icon" : "bg-tile-amber-icon"
                }`} />

                <div>
                  {/* Icon Area */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`size-14 rounded-2xl flex items-center justify-center shadow-sm border border-border/40 ${c.bgClass}`}>
                      <Icon className="size-7 text-primary" strokeWidth={2.2} />
                    </div>
                    <span className="text-3xl" role="img" aria-label={c.title}>
                      {c.emoji}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 uppercase">
                    {c.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground mb-6">
                    {c.desc}
                  </p>
                </div>

                {/* Confirm Button */}
                <Link
                  to={c.to}
                  className={`mt-4 w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 border shadow-sm ${
                    c.color === "green" 
                      ? "bg-accent/80 hover:bg-accent text-primary border-primary/20 hover:border-primary/40" 
                      : c.color === "blue"
                      ? "bg-tile-blue/80 hover:bg-tile-blue text-tile-blue-icon border-tile-blue-icon/20 hover:border-tile-blue-icon/40"
                      : "bg-tile-amber/80 hover:bg-tile-amber text-tile-amber-icon border-tile-amber-icon/20 hover:border-tile-amber-icon/40"
                  }`}
                >
                  {c.buttonText}
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </section>

        {/* Demo Operations Check */}
        <footer className="w-full text-center flex flex-col items-center gap-4 animate-fade-in mt-4">
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border bg-white rounded-2xl max-w-sm w-full shadow-sm">
            <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase">
              <span className="inline-block size-2 rounded-full bg-primary animate-ping" />
              Quick Evaluation Sandbox
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              Skip typing login parameters to test full farmer advisory and DBT ledger functionalities.
            </p>
            <button
              onClick={handleGuestMode}
              className="mt-3.5 w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition text-xs shadow-sm"
            >
              Continue as Guest (Demo Mode)
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 justify-center py-2 px-4 rounded-full bg-accent/60 text-[10px] text-primary font-semibold border border-primary/10">
            <span className="bg-primary/10 p-0.5 rounded">🔒 SECURED Ledger</span>
            <span>Unified DBT Government Cryptographic Auditing Protocol Active</span>
          </div>
        </footer>
      </div>

      <div className="text-center text-[10px] text-muted-foreground mt-8">
        © 2026 AgriSphere AI Portal. All Rights Secured under DBT Smart Farmer Framework.
      </div>
    </div>
  );
}
