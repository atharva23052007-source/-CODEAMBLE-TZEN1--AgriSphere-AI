import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  LayoutGrid,
  Bot,
  FileText,
  User,
  Bell,
  MapPin,
  ChevronRight,
  ChevronDown,
  Sprout,
  IndianRupee,
  Landmark,
  ShieldCheck,
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Headphones,
  Sparkles,
  Mic,
  Check,
  Globe,
  Leaf,
} from "lucide-react";
import farmerAvatar from "@/assets/farmer-avatar.jpg";
import farmerIllustration from "@/assets/farmer-illustration.png";
import soybeanImg from "@/assets/soybean.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

type Lang = "en" | "mr" | "hi";

const nav = [
  { id: "home", label: "Home", icon: Home },
  { id: "services", label: "Services", icon: LayoutGrid },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "docs", label: "My Documents", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

const services = [
  {
    title: "Crop Advice",
    desc: "Get AI based crop advisory & best practices",
    Icon: Sprout,
    tone: "green",
  },
  {
    title: "Market Prices",
    desc: "Check latest mandi prices & trends",
    Icon: IndianRupee,
    tone: "amber",
  },
  {
    title: "Government Schemes",
    desc: "Find & apply for suitable schemes",
    Icon: Landmark,
    tone: "blue",
  },
  {
    title: "My Documents",
    desc: "Store & manage your important documents",
    Icon: FileText,
    tone: "violet",
  },
  {
    title: "Insurance",
    desc: "View & buy crop insurance plans",
    Icon: ShieldCheck,
    tone: "mint",
  },
  {
    title: "Ask AI",
    desc: "Ask anything about farming in your language",
    Icon: Bot,
    tone: "lilac",
  },
] as const;

const toneClasses: Record<string, { bg: string; icon: string }> = {
  green: { bg: "bg-tile-green", icon: "text-tile-green-icon" },
  amber: { bg: "bg-tile-amber", icon: "text-tile-amber-icon" },
  blue: { bg: "bg-tile-blue", icon: "text-tile-blue-icon" },
  violet: { bg: "bg-tile-violet", icon: "text-tile-violet-icon" },
  mint: { bg: "bg-tile-mint", icon: "text-tile-mint-icon" },
  lilac: { bg: "bg-tile-lilac", icon: "text-tile-lilac-icon" },
};

const recommendation: Record<Lang, string> = {
  en: "The next 10 days are ideal for sowing soybean (15–25 June). Use certified seed and apply organic fertilizer for best yield.",
  mr: "तुमच्या सोयाबीन पिकासाठी सध्या पेरणीचा योग्य कालावधी आहे (१५ - २५ जून). सुधारित बियाणे वापरा आणि सेंद्रिय खतांचा वापर करा.",
  hi: "आपकी सोयाबीन फसल के लिए बुवाई का उपयुक्त समय है (15 - 25 जून)। प्रमाणित बीज और जैविक खाद का प्रयोग करें।",
};

const t = {
  en: {
    welcome: "Welcome, Rajesh!",
    sub: "What would you like to do today?",
    weather: "Today's Weather",
    partly: "Partly Cloudy",
    humidity: "Humidity",
    wind: "Wind",
    rain: "Rain Chance",
    price: "Today's Crop Price",
    viewAll: "View All",
    updated: "Updated: Today, 08:30 AM",
    reco: "AI Recommendation",
    listen: "Listen",
    viewReco: "View All Recommendations",
    speak: "Speak to AI",
    tagline: "For farmers, solutions to problems!",
    help: "We are here to make farming easier and more profitable.",
    lang: "Language / भाषा",
  },
  mr: {
    welcome: "स्वागत आहे, राजेश!",
    sub: "आज तुम्हाला काय करायचे आहे?",
    weather: "आजचे हवामान",
    partly: "अंशतः ढगाळ",
    humidity: "आर्द्रता",
    wind: "वारा",
    rain: "पावसाची शक्यता",
    price: "आजचा पीक भाव",
    viewAll: "सर्व पहा",
    updated: "अद्यतनित: आज, ०८:३० AM",
    reco: "AI शिफारस",
    listen: "ऐका",
    viewReco: "सर्व शिफारसी पहा",
    speak: "AI शी बोला",
    tagline: "शेतकऱ्यांसाठी, समस्यांचे समाधान!",
    help: "आम्ही शेती अधिक सोपी आणि फायदेशीर बनवण्यासाठी येथे आहोत.",
    lang: "भाषा",
  },
  hi: {
    welcome: "स्वागत है, राजेश!",
    sub: "आज आप क्या करना चाहेंगे?",
    weather: "आज का मौसम",
    partly: "आंशिक बादल",
    humidity: "नमी",
    wind: "हवा",
    rain: "बारिश की संभावना",
    price: "आज का फसल भाव",
    viewAll: "सभी देखें",
    updated: "अपडेट: आज, 08:30 AM",
    reco: "AI सिफारिश",
    listen: "सुनें",
    viewReco: "सभी सिफारिशें देखें",
    speak: "AI से बात करें",
    tagline: "किसानों के लिए, समस्याओं का समाधान!",
    help: "हम खेती को आसान और लाभदायक बनाने के लिए यहाँ हैं।",
    lang: "भाषा",
  },
};

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [active, setActive] = useState("home");
  const L = t[lang];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[300px] shrink-0 flex-col bg-sidebar border-r border-border p-6 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
              <Leaf className="size-7 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <span className="text-primary">AgriSphere</span>{" "}
                <span className="text-[oklch(0.35_0.15_255)]">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                Unified Agricultural<br />Financial Ecosystem
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 mt-2">
            {nav.map((n) => {
              const Icon = n.icon;
              const isActive = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setActive(n.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition ${
                    isActive
                      ? "bg-accent text-primary"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Icon className="size-5" />
                  {n.label}
                </button>
              );
            })}
          </nav>

          {/* Help card */}
          <div className="mt-auto rounded-2xl bg-accent/60 p-4 flex gap-3">
            <div className="size-16 shrink-0 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden">
              <img src={farmerIllustration} alt="Farmer" className="size-full object-cover" loading="lazy" width={512} height={512} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary leading-snug">
                {L.tagline}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                {L.help}
              </p>
            </div>
          </div>

          {/* Language switcher */}
          <div className="rounded-2xl border border-border bg-white p-3">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
              <Globe className="size-4" />
              {L.lang}
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {(
                [
                  { id: "en", label: "English" },
                  { id: "mr", label: "मराठी" },
                  { id: "hi", label: "हिंदी" },
                ] as const
              ).map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                    lang === l.id
                      ? "bg-accent text-primary"
                      : "hover:bg-secondary text-foreground/80"
                  }`}
                >
                  {l.label}
                  {lang === l.id && <Check className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 px-4 sm:px-8 lg:px-10 pt-6 lg:pt-8 pb-32 lg:pb-10">
            {/* Header */}
            <header className="flex items-center gap-4 justify-between flex-wrap">
              <div className="flex items-center gap-4">
                <div className="size-14 lg:size-16 rounded-full bg-accent border border-border overflow-hidden">
                  <img src={farmerAvatar} alt="Rajesh" className="size-full object-cover" width={512} height={512} />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-[28px] font-bold text-primary leading-tight">
                    {L.welcome}
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    {L.sub}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  aria-label="Notifications"
                  className="size-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-secondary transition"
                >
                  <Bell className="size-5 text-foreground/70" />
                </button>
                <button className="flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-white hover:bg-secondary transition text-sm font-medium">
                  <MapPin className="size-4 text-primary" />
                  Satara, Maharashtra
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </div>
            </header>

            {/* Service grid */}
            <section className="mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
              {services.map((s) => {
                const tone = toneClasses[s.tone];
                const Icon = s.Icon;
                return (
                  <button
                    key={s.title}
                    className={`group relative text-left rounded-2xl ${tone.bg} p-5 lg:p-6 flex items-center gap-4 lg:gap-5 border border-transparent hover:border-border transition shadow-sm hover:shadow-md`}
                  >
                    <div className="size-16 lg:size-[72px] shrink-0 rounded-full bg-white/80 flex items-center justify-center">
                      <Icon className={`size-8 lg:size-9 ${tone.icon}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-foreground leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-snug">
                        {s.desc}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </section>

            {/* Info row */}
            <section className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              {/* Weather */}
              <div className="rounded-2xl bg-card border border-border p-5 lg:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CloudSun className="size-5 text-primary" />
                  <h3 className="text-base lg:text-lg font-semibold">{L.weather}</h3>
                </div>
                <div className="text-5xl lg:text-6xl font-extrabold tracking-tight">
                  28°C
                </div>
                <p className="text-muted-foreground mt-1">{L.partly}</p>

                <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-border">
                  <Stat icon={Droplets} label={L.humidity} value="68%" />
                  <Stat icon={Wind} label={L.wind} value="12 km/h" />
                  <Stat icon={CloudRain} label={L.rain} value="20%" />
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-primary bg-accent/60 rounded-lg px-3 py-2">
                  <MapPin className="size-4" />
                  Satara, Maharashtra
                </div>
              </div>

              {/* Crop Price */}
              <div className="rounded-2xl bg-card border border-border p-5 lg:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base lg:text-lg font-semibold">{L.price}</h3>
                  <button className="text-sm text-primary font-medium hover:underline">
                    {L.viewAll}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-xl bg-tile-green overflow-hidden flex items-center justify-center">
                    <img src={soybeanImg} alt="Soybean" className="size-full object-cover" loading="lazy" width={512} height={512} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Soybean</div>
                    <div className="text-sm text-muted-foreground">Latur Mandi</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between bg-accent/60 rounded-xl px-4 py-3">
                  <div className="text-xl lg:text-2xl font-extrabold text-primary">
                    ₹4,892 <span className="text-sm font-medium text-muted-foreground">/ क्विंटल</span>
                  </div>
                  <div className="text-sm font-semibold text-primary">↑ 2.4%</div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  {L.updated}
                </p>
              </div>

              {/* AI Reco */}
              <div className="rounded-2xl bg-card border border-border p-5 lg:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="size-5 text-primary" />
                  <h3 className="text-base lg:text-lg font-semibold">{L.reco}</h3>
                </div>

                <div className="rounded-xl bg-accent/60 p-4">
                  <p className="text-[15px] leading-relaxed text-foreground">
                    {recommendation[lang]}
                  </p>

                  <button className="mt-4 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition">
                    <Headphones className="size-5" />
                    {lang === "mr" ? "ऐका (Listen)" : lang === "hi" ? "सुनें (Listen)" : "Listen"}
                  </button>
                </div>

                <button className="mt-4 w-full text-sm text-primary font-medium hover:underline text-center">
                  {L.viewReco}
                </button>
              </div>
            </section>
          </div>

          {/* Mobile bottom nav */}
          <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-2 pt-2 pb-3 z-40">
            <div className="grid grid-cols-5 items-end relative">
              {nav.slice(0, 2).map((n) => (
                <NavBtn key={n.id} n={n} active={active} setActive={setActive} />
              ))}
              <div className="flex justify-center">
                <button
                  aria-label={L.speak}
                  className="-mt-8 size-16 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition ring-4 ring-background"
                >
                  <Mic className="size-7" />
                </button>
              </div>
              {nav.slice(3).map((n) => (
                <NavBtn key={n.id} n={n} active={active} setActive={setActive} />
              ))}
            </div>
            <p className="text-center text-xs font-medium text-primary mt-1">{L.speak}</p>
          </nav>

          {/* Desktop bottom bar (mirrors screenshot) */}
          <div className="hidden lg:block sticky bottom-0 bg-white/95 backdrop-blur border-t border-border">
            <div className="max-w-5xl mx-auto px-6 py-3 grid grid-cols-5 items-center relative">
              <BottomItem icon={Home} label="Home" active />
              <BottomItem icon={LayoutGrid} label="Services" />
              <div className="flex flex-col items-center">
                <button
                  aria-label={L.speak}
                  className="-mt-10 size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition ring-4 ring-white"
                >
                  <Mic className="size-7" />
                </button>
                <span className="text-xs font-semibold text-primary mt-1">{L.speak}</span>
              </div>
              <BottomItem icon={FileText} label="Documents" />
              <BottomItem icon={User} label="Profile" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5 text-primary" />
        {label}
      </div>
      <div className="text-base font-semibold mt-1">{value}</div>
    </div>
  );
}

function NavBtn({
  n,
  active,
  setActive,
}: {
  n: { id: string; label: string; icon: typeof Home };
  active: string;
  setActive: (id: string) => void;
}) {
  const Icon = n.icon;
  const isActive = active === n.id;
  return (
    <button
      onClick={() => setActive(n.id)}
      className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="size-5" />
      {n.label}
    </button>
  );
}

function BottomItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 text-xs font-medium ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
}
