import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Volume2,
  Search,
  Send,
  Plus,
  Trash2,
  ArrowLeft,
  UploadCloud,
  Info,
  AlertCircle,
  Download,
  Eye,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import farmerAvatar from "@/assets/farmer-avatar.jpg";
import farmerIllustration from "@/assets/farmer-illustration.png";
import soybeanImg from "@/assets/soybean.jpg";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/farmer")({
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
    welcome: "👋 Namaste, Rajesh!",
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
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [farmerProfile, setFarmerProfile] = useState({
    name: "Rajesh Patil",
    phone: "9876543210",
    village: "Satara",
    landSize: "5.5",
    primaryCrop: "Soybean",
    accountNo: "30214587963",
    ifscCode: "SBIN0001092"
  });
  const [mounted, setMounted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [triggerVoiceInit, setTriggerVoiceInit] = useState(false);
  const L = t[lang];

  useEffect(() => {
    setMounted(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (targetLang: Lang = "mr") => {
    if (!("speechSynthesis" in window)) {
      toast.error("Speech Synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.info("Audio playback paused.");
      return;
    }

    const textToSpeak = recommendation[targetLang];
    
    // Web Speech synthesis triggers
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.volume = 1.0;
    utterance.rate = 0.85; // Slightly slower speed for clearer clarity on agricultural terms
    
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    let voiceMatchedLabel = "";
    
    if (targetLang === "mr") {
      // 1. Try native Marathi voice
      selectedVoice = voices.find(v => v.lang.startsWith("mr-IN") || v.lang.startsWith("mr"));
      if (selectedVoice) {
        utterance.lang = "mr-IN";
        voiceMatchedLabel = "Marathi";
      } else {
        // 2. Try Hindi voice (Devanagari script renders Marathi text flawlessly)
        selectedVoice = voices.find(v => v.lang.startsWith("hi-IN") || v.lang.startsWith("hi"));
        if (selectedVoice) {
          utterance.lang = "hi-IN";
          voiceMatchedLabel = "Marathi (via Hindi TTS fallback)";
        } else {
          // 3. Try any Indian voice context
          selectedVoice = voices.find(v => v.lang.includes("IN"));
          utterance.lang = "mr-IN";
          voiceMatchedLabel = "Marathi (System Standard)";
        }
      }
    } else if (targetLang === "hi") {
      selectedVoice = voices.find(v => v.lang.startsWith("hi-IN") || v.lang.startsWith("hi"));
      utterance.lang = "hi-IN";
      voiceMatchedLabel = "Hindi";
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en"));
      utterance.lang = "en-US";
      voiceMatchedLabel = "English";
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = targetLang === "mr" ? "mr-IN" : targetLang === "hi" ? "hi-IN" : "en-US";
      voiceMatchedLabel = targetLang === "mr" ? "Marathi" : targetLang === "hi" ? "Hindi" : "English";
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      toast.success(`🔊 Playing recommendation in ${voiceMatchedLabel}...`);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active, selectedService]);

  const onServiceClick = (title: string) => {
    if (title === "Crop Advice") {
      setActive("services");
      setSelectedService("crop-advice");
    } else if (title === "Market Prices") {
      setActive("services");
      setSelectedService("market-prices");
    } else if (title === "Government Schemes") {
      setActive("services");
      setSelectedService("gov-schemes");
    } else if (title === "My Documents") {
      setActive("docs");
    } else if (title === "Insurance") {
      setActive("services");
      setSelectedService("insurance");
    } else if (title === "Ask AI") {
      setActive("ai");
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans">
      <Toaster position="top-right" />
      <div className="flex min-h-dvh">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[300px] shrink-0 flex-col bg-sidebar border-r border-border p-6 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm overflow-hidden p-1">
              <img src={logoImg} alt="AgriSphere AI Emblem" className="size-full object-contain" />
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
                  onClick={() => { setActive(n.id); setSelectedService(null); }}
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
          <div className="rounded-2xl bg-accent/60 p-4 flex gap-3">
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
                  onClick={() => { setLang(l.id); toast.success(`Language switched to ${l.label}!`); }}
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
          <div className="flex-1 px-4 sm:px-8 lg:px-10 pt-6 lg:pt-8 pb-32 lg:pb-10 flex flex-col">
            {/* Header */}
            <header className="flex items-center gap-4 justify-between flex-wrap mb-6 lg:mb-8 border-b border-border/40 pb-4">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActive("profile")}>
                <div className="size-14 lg:size-16 rounded-full bg-accent border border-border overflow-hidden ring-2 ring-primary/20">
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
                  onClick={() => toast.info("No active agricultural alerts for Satara region.")}
                  aria-label="Notifications"
                  className="size-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-secondary transition shadow-sm"
                >
                  <Bell className="size-5 text-foreground/75" />
                </button>
                <button 
                  onClick={() => toast.info("GPS coordinates locked: Satara district, Maharashtra.")}
                  className="flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-white hover:bg-secondary transition text-sm font-medium shadow-sm"
                >
                  <MapPin className="size-4 text-primary" />
                  Satara, Maharashtra
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </div>
            </header>

            {/* Subpages renderer */}
            <div className="flex-1 flex flex-col w-full">
              {active === "home" && (
                <div className="flex-1 flex flex-col gap-6 lg:gap-8 animate-fade-in">
                  {/* Service grid */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                    {services.map((s) => {
                      const tone = toneClasses[s.tone];
                      const Icon = s.Icon;
                      return (
                        <button
                          key={s.title}
                          onClick={() => onServiceClick(s.title)}
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
                          <ChevronRight className="size-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition" />
                        </button>
                      );
                    })}
                  </section>

                  {/* Info row */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                    {/* Weather */}
                    <div className="rounded-2xl bg-card border border-border p-5 lg:p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <CloudSun className="size-5 text-primary" />
                        <h3 className="text-base lg:text-lg font-semibold">{L.weather}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-5xl lg:text-6xl font-extrabold tracking-tight">
                            28°C
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">{L.partly}</p>
                        </div>
                        <div className="text-right border-l border-border pl-4">
                          <span className="text-xs text-muted-foreground block font-medium">Tomorrow's Rain</span>
                          <div className="flex items-center gap-1 justify-end mt-1 text-primary">
                            <CloudRain className="size-4" />
                            <span className="text-base font-bold">60%</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground block font-medium">Light Showers</span>
                        </div>
                      </div>

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
                        <button onClick={() => { setActive("services"); setSelectedService("market-prices"); }} className="text-sm text-primary font-semibold hover:underline">
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
                      <div className="flex items-center mb-4 justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-5 text-primary" />
                          <h3 className="text-base lg:text-lg font-semibold">{L.reco}</h3>
                        </div>
                        <button 
                          onClick={() => handleSpeak(lang === "en" ? "mr" : lang)} 
                          title="Speak Recommendation" 
                          className="hover:scale-110 active:scale-95 transition size-9 rounded-full bg-secondary flex items-center justify-center border border-border"
                        >
                          <Volume2 className={`size-4.5 ${isSpeaking ? "text-primary animate-pulse" : "text-foreground/70"}`} />
                        </button>
                      </div>

                      <div className="rounded-xl bg-accent/60 p-4">
                        <p className="text-[15px] leading-relaxed text-foreground font-semibold">
                          {recommendation[lang]}
                        </p>

                        <button 
                          onClick={() => handleSpeak(lang === "en" ? "mr" : lang)}
                          className={`mt-4 w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm ${isSpeaking ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" : "bg-primary text-primary-foreground hover:bg-primary/95"}`}
                        >
                          {isSpeaking ? (
                            <>
                              <Volume2 className="size-5 animate-pulse" />
                              Stop Listening
                            </>
                          ) : (
                            <>
                              <Headphones className="size-5" />
                              {lang === "mr" ? "ऐका (Listen)" : lang === "hi" ? "सुनें (Listen)" : "🔊 Listen in Marathi"}
                            </>
                          )}
                        </button>
                      </div>

                      <button onClick={() => { setActive("services"); setSelectedService("crop-advice"); }} className="mt-4 w-full text-sm text-primary font-medium hover:underline text-center">
                        {L.viewReco}
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {active === "services" && (
                <ServicesView selectedService={selectedService} setSelectedService={setSelectedService} mounted={mounted} />
              )}

              {active === "ai" && (
                <AiAssistantView lang={lang} triggerVoiceInit={triggerVoiceInit} setTriggerVoiceInit={setTriggerVoiceInit} />
              )}

              {active === "docs" && (
                <DocumentsView />
              )}

              {active === "profile" && (
                <ProfileView profile={farmerProfile} setProfile={setFarmerProfile} />
              )}
            </div>
          </div>

          {/* Mobile bottom nav */}
          <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-2 pt-2 pb-3 z-45">
            <div className="grid grid-cols-5 items-end relative">
              {nav.slice(0, 2).map((n) => (
                <NavBtn key={n.id} n={n} active={active} setActive={(id) => { setActive(id); setSelectedService(null); }} />
              ))}
              <div className="flex justify-center flex-col items-center">
                <button
                  onClick={() => { setActive("ai"); setSelectedService(null); setTriggerVoiceInit(true); }}
                  aria-label={L.speak}
                  className={`-mt-8 size-16 rounded-full flex flex-col items-center justify-center shadow-lg transition ring-4 ring-background ${active === "ai" ? "bg-accent text-primary ring-accent" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  <Mic className="size-7" />
                </button>
              </div>
              {nav.slice(3).map((n) => (
                <NavBtn key={n.id} n={n} active={active} setActive={(id) => { setActive(id); setSelectedService(null); }} />
              ))}
            </div>
            <p className="text-center text-[10px] font-semibold text-primary mt-1">{L.speak}</p>
          </nav>

          {/* Desktop bottom bar */}
          <div className="hidden lg:block sticky bottom-0 bg-white/95 backdrop-blur border-t border-border z-40">
            <div className="max-w-5xl mx-auto px-6 py-3 grid grid-cols-5 items-center relative">
              <BottomItem icon={Home} label="Home" active={active === "home"} onClick={() => { setActive("home"); setSelectedService(null); }} />
              <BottomItem icon={LayoutGrid} label="Services" active={active === "services"} onClick={() => { setActive("services"); setSelectedService(null); }} />
              <div className="flex flex-col items-center">
                <button
                  onClick={() => { setActive("ai"); setSelectedService(null); setTriggerVoiceInit(true); }}
                  aria-label={L.speak}
                  className={`-mt-10 size-16 rounded-full flex items-center justify-center shadow-lg transition ring-4 ring-white ${active === "ai" ? "bg-accent/80 text-primary ring-accent" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  <Mic className="size-7" />
                </button>
                <span className={`text-[11px] font-bold mt-1 ${active === "ai" ? "text-primary font-extrabold" : "text-muted-foreground"}`}>{L.speak}</span>
              </div>
              <BottomItem icon={FileText} label="Documents" active={active === "docs"} onClick={() => { setActive("docs"); setSelectedService(null); }} />
              <BottomItem icon={User} label="Profile" active={active === "profile"} onClick={() => { setActive("profile"); setSelectedService(null); }} />
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
  n: { id: string; label: string; icon: any };
  active: string;
  setActive: (id: string) => void;
}) {
  const Icon = n.icon;
  const isActive = active === n.id;
  return (
    <button
      onClick={() => setActive(n.id)}
      className={`flex flex-col items-center gap-1 py-1.5 text-[11px] font-semibold transition ${
        isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
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
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-xs font-semibold transition cursor-pointer ${
        active ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
}

function ProfileView({ profile, setProfile }: { profile: any; setProfile: any }) {
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState(profile);
  const handleSave = (e: any) => {
    e.preventDefault();
    const errs: any = {};
    if (!form.name || form.name.length < 3) errs.name = "Name must be at least 3 characters";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Phone must be exactly 10 digits";
    if (!form.village) errs.village = "Village cannot be empty";
    if (isNaN(Number(form.landSize)) || Number(form.landSize) <= 0) errs.landSize = "Farm size must be a number greater than 0";
    if (!/^\d{9,18}$/.test(form.accountNo)) errs.accountNo = "Account number must be 9 to 18 digits";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode)) errs.ifscCode = "Invalid IFSC Code (e.g. SBIN0001092)";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please correct the form validation errors.");
      return;
    }
    setErrors({});
    setProfile(form);
    toast.success("DBT Farm Profile saved successfully!");
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm max-w-xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
        <User className="size-5 text-primary" />
        <h3 className="text-base lg:text-lg font-bold text-primary">Edit Farm & DBT Profile Information</h3>
      </div>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Farmer Name</label>
          <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          {errors.name && <p className="text-xs text-destructive mt-1 font-medium">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Phone Number</label>
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
            {errors.phone && <p className="text-xs text-destructive mt-1 font-medium">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Village / Region</label>
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={form.village} onChange={e=>setForm({...form, village:e.target.value})} />
            {errors.village && <p className="text-xs text-destructive mt-1 font-medium">{errors.village}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Farm Land Size (Acres)</label>
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={form.landSize} onChange={e=>setForm({...form, landSize:e.target.value})} />
            {errors.landSize && <p className="text-xs text-destructive mt-1 font-medium">{errors.landSize}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Primary Crop</label>
            <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={form.primaryCrop} onChange={e=>setForm({...form, primaryCrop:e.target.value})}>
              <option value="Soybean">Soybean</option>
              <option value="Cotton">Cotton</option>
              <option value="Wheat">Wheat</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
          </div>
        </div>
        <div className="border-t border-border pt-3 mt-1">
          <h4 className="text-xs font-bold text-primary mb-3">Bank Details (Direct Benefit Transfer)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Account Number</label>
              <input type="password" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white font-mono" value={form.accountNo} onChange={e=>setForm({...form, accountNo:e.target.value})} />
              {errors.accountNo && <p className="text-xs text-destructive mt-1 font-medium">{errors.accountNo}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">IFSC Code</label>
              <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white uppercase font-mono" value={form.ifscCode} onChange={e=>setForm({...form, ifscCode:e.target.value})} />
              {errors.ifscCode && <p className="text-xs text-destructive mt-1 font-medium">{errors.ifscCode}</p>}
            </div>
          </div>
        </div>
        <button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 mt-2 transition text-sm">Save DBT Farm Details</button>
      </form>
    </div>
  );
}

function DocumentsView() {
  const [docs, setDocs] = useState([
    { id: "1", name: "7/12 Land Record Extract", type: "Land Registry", size: "156 KB", date: "12 May 2026" },
    { id: "2", name: "Soil Health Advisory Card", type: "Soil Test Report", size: "210 KB", date: "01 Jun 2026" },
    { id: "3", name: "PM Fasal Insurance Policy", type: "Insurance Documentation", size: "320 KB", date: "15 Jun 2026" }
  ]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Land Registry");
  const [progress, setProgress] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const handleUpload = (e: any) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a valid document name");
      return;
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(interval);
          setDocs(d => [...d, { id: Date.now().toString(), name: name.trim(), type, size: "120 KB", date: "Today" }]);
          toast.success("Document uploaded successfully to Secure AgriSphere Locker!");
          setName("");
          return null;
        }
        return p + 20;
      });
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 w-full font-sans">
      <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
          <FileText className="size-5 text-primary" />
          <h3 className="text-base lg:text-lg font-bold text-primary">Your Documents Locker</h3>
        </div>
        <div className="flex flex-col gap-3">
          {docs.map(doc => (
            <div key={doc.id} className="flex justify-between items-center p-3 border border-border bg-accent/20 rounded-xl flex-wrap sm:flex-nowrap gap-3">
              <div>
                <p className="font-semibold text-sm text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.type} • {doc.size} • {doc.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPreviewDoc(doc)} className="px-3 py-1.5 border border-border text-xs font-semibold rounded-lg bg-white hover:bg-secondary transition flex items-center gap-1">
                  <Eye className="size-3" /> View
                </button>
                <button onClick={() => toast.success(`Initiated secure download for ${doc.name} (PDF)...`)} className="px-3 py-1.5 border border-border text-xs font-semibold rounded-lg bg-white hover:bg-secondary transition flex items-center gap-1">
                  <Download className="size-3" /> Download
                </button>
                <button onClick={() => { setDocs(docs.filter(d=>d.id !== doc.id)); toast.success("Document removed from vault."); }} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm">
        <h4 className="font-bold text-primary mb-3 text-sm flex items-center gap-1.5"><Plus className="size-4" /> Add Document</h4>
        <form onSubmit={handleUpload} className="flex flex-col gap-3">
          <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" placeholder="Document Name (e.g. Soil Report 2026)" value={name} onChange={e=>setName(e.target.value)} />
          <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={type} onChange={e=>setType(e.target.value)}>
            <option value="Land Registry">Land Registry (7/12, Khata)</option>
            <option value="Soil Test Report">Soil Health Test Card</option>
            <option value="Insurance Documentation">Crop Insurance Receipt</option>
            <option value="Identification ID">Aadhaar / Farmer ID Card</option>
          </select>
          <div className="flex items-center gap-2 border border-border rounded-lg p-3 bg-white">
            <UploadCloud className="size-5 text-primary shrink-0" />
            <input type="file" className="text-xs text-muted-foreground file:bg-secondary file:text-foreground file:border-0 file:py-1 file:px-3 file:rounded-md file:mr-2 file:cursor-pointer mr-auto cursor-pointer" onChange={() => {}} />
          </div>
          {progress !== null && (
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-1">
              <div className="bg-primary h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          <button type="submit" disabled={progress !== null} className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 mt-2 transition text-sm">
            {progress !== null ? `Uploading (${progress}%)` : "Verify & Upload to Locker"}
          </button>
        </form>
      </div>

      {previewDoc && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-border rounded-2xl p-5 max-w-sm w-full shadow-lg">
            <h4 className="font-bold text-lg text-primary border-b pb-2 mb-3">{previewDoc.name}</h4>
            <div className="space-y-2 text-sm py-2">
              <p>Type: <span className="font-semibold text-foreground">{previewDoc.type}</span></p>
              <p>Size: <span className="font-semibold text-foreground">{previewDoc.size}</span></p>
              <p>Created: <span className="font-semibold text-foreground">{previewDoc.date}</span></p>
              <p>Verification Code: <span className="font-semibold text-foreground font-mono">AS-{previewDoc.id}9F-26</span></p>
            </div>
            <div className="my-4 p-3 border border-border rounded-xl bg-green-50/50 text-[11px] text-primary flex gap-2">
              <Check className="size-4 shrink-0 mt-0.5" />
              <span>Cryptographically verified on DBT Agricultural Ledger. Secure and unalterable.</span>
            </div>
            <button onClick={() => setPreviewDoc(null)} className="w-full py-2 bg-secondary text-foreground font-semibold hover:bg-secondary/80 rounded-xl transition text-sm">Close Document Preview</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AiAssistantView({ 
  lang,
  triggerVoiceInit,
  setTriggerVoiceInit
}: { 
  lang: string;
  triggerVoiceInit?: boolean;
  setTriggerVoiceInit?: (val: boolean) => void;
}) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste Rajesh! I am AgriSphere Helper. Ask me anything about crop advisory, pests, fertilizers, or mandi prices (English, मराठी, हिंदी)." }
  ]);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMockReply = (q: string) => {
    const qLower = q.toLowerCase();
    if (qLower.includes("soybean") || qLower.includes("yellow") || qLower.includes("mosaic")) {
      return "Yellow Mosaic Virus in Soybean is spread by whiteflies. Control them by spraying Thiamethoxam 25% WG (40g/acre) or Acetamiprid 20% SP (50g/acre). Uproot infected plants immediately.";
    }
    if (qLower.includes("fertilizer") || qLower.includes("sugarcane") || qLower.includes("nitrogen")) {
      return "For sugarcane, apply 250 kg Nitrogen, 115 kg Phosphorus, and 115 kg Potassium per hectare. Split Nitrogen into 3 doses: planting, 60 days, and 120 days of growth.";
    }
    if (qLower.includes("water") || qLower.includes("irrigation") || qLower.includes("drip")) {
      return "Drip irrigation is recommended in Maharashtra. Ensure watering during Soybean flowering (35-40 days) and pod development (65-70 days) to maximize seed yield.";
    }
    return "That's an important crop query. I suggest checking your regional Soil Health Card for N-P-K deficiency, and applying organic manure before sowing.";
  };

  const speakText = (txt: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(txt);
      utterance.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    const userMsg = queryText.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setText("");
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMsg })
      });

      if (resp.ok) {
        const data = await resp.json();
        const aiAnswer = data.answer || getMockReply(userMsg);
        setMessages(prev => [...prev, { role: "ai", text: aiAnswer }]);
        speakText(aiAnswer);
      } else {
        const aiAnswer = getMockReply(userMsg);
        setMessages(prev => [...prev, { role: "ai", text: aiAnswer }]);
        speakText(aiAnswer);
      }
    } catch (err) {
      const aiAnswer = getMockReply(userMsg);
      setMessages(prev => [...prev, { role: "ai", text: aiAnswer }]);
      speakText(aiAnswer);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: any) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter a question for the AI Assistant.");
      return;
    }
    handleSendQuery(text);
  };

  const handleVoiceSim = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-US";

      recognition.onstart = () => {
        setRecording(true);
        toast.info("Listening... Speak your question now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText(transcript);
          toast.success(`Transcribed: "${transcript}"`);
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setRecording(false);
        runFallbackSim();
      };

      recognition.onend = () => {
        setRecording(false);
      };

      try {
        recognition.start();
      } catch (err) {
        runFallbackSim();
      }
    } else {
      runFallbackSim();
    }
  };

  const runFallbackSim = () => {
    setRecording(true);
    toast.info("Listening... Speak your crop question into the microphone.");
    setTimeout(() => {
      setRecording(false);
      const questions = [
        "What is the best pesticide for soybean yellow mosaic?",
        "When should I apply urea fertilizer to sugarcane?",
        "Is Satara drip irrigation eligible for sub-grants?"
      ];
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      setText(randomQ);
      toast.success(`Transcribed: "${randomQ}"`);
      handleSendQuery(randomQ);
    }, 1800);
  };

  useEffect(() => {
    if (triggerVoiceInit) {
      handleVoiceSim();
      if (setTriggerVoiceInit) {
        setTriggerVoiceInit(false);
      }
    }
  }, [triggerVoiceInit]);

  return (
    <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-5 shadow-sm h-[480px] flex flex-col justify-between w-full">
      <div className="flex-grow overflow-y-auto pr-1 space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-secondary text-foreground rounded-tl-none font-medium"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-foreground rounded-2xl rounded-tl-none px-4 py-2 text-xs animate-pulse">AgriSphere Helper is thinking...</div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 pt-4 border-t border-border mt-3">
        <div className="flex gap-1.5 flex-wrap">
          <button type="button" onClick={() => setText("Yellow Mosaic on Soybean")} className="px-2.5 py-1 text-xs border border-border rounded-lg hover:border-primary transition bg-white font-medium text-muted-foreground hover:text-primary">Yellow Mosaic</button>
          <button type="button" onClick={() => setText("Sugarcane Fertilizer doses")} className="px-2.5 py-1 text-xs border border-border rounded-lg hover:border-primary transition bg-white font-medium text-muted-foreground hover:text-primary">Sugarcane Fertilizer</button>
          <button type="button" onClick={() => setText("Drip irrigation setup Satara")} className="px-2.5 py-1 text-xs border border-border rounded-lg hover:border-primary transition bg-white font-medium text-muted-foreground hover:text-primary">Drip Irrigation</button>
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input className="flex-grow border border-border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Type crop query in your language..." value={text} onChange={e=>setText(e.target.value)} />
          <button type="button" onClick={handleVoiceSim} className={`size-10 rounded-xl flex items-center justify-center transition border shrink-0 ${recording ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-white border-border hover:bg-secondary text-primary"}`}>
            <Mic className="size-5" />
          </button>
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition text-sm shrink-0">Send</button>
        </form>
      </div>
    </div>
  );
}

function ServicesView({ selectedService, setSelectedService, mounted }: { selectedService: string | null; setSelectedService: any; mounted: boolean }) {
  const [crop, setCrop] = useState("");
  const [stage, setStage] = useState("");
  const [notes, setNotes] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const [mandi, setMandi] = useState("Latur");
  const [mandiCrop, setMandiCrop] = useState("Soybean");

  const [land, setLand] = useState("");
  const [income, setIncome] = useState("");
  const [schemeState, setSchemeState] = useState("Maharashtra");
  const [eligible, setEligible] = useState<any>(null);

  const [insSurvey, setInsSurvey] = useState("");
  const [insCover, setInsCover] = useState("");
  const [insFileUploaded, setInsFileUploaded] = useState(false);
  const [insProgress, setInsProgress] = useState<number | null>(null);
  const [insResult, setInsResult] = useState<any>(null);

  const handleAdvice = (e: any) => {
    e.preventDefault();
    if (!crop || !stage) {
      toast.error("Please choose a crop type and growth stage.");
      return;
    }
    setAdviceLoading(true);
    setTimeout(() => {
      setAdviceLoading(false);
      setAdvice(`Recommended Actions for ${crop} at ${stage} stage: Current Satara weather forecasts high soil humidity. Sow on raised seed beds. Treat seeds with Trichoderma (10g/kg). Split Nitrogen doses into 3 equal applications (planting, vegetative, and flowering). Keep soil moisture around 60%.`);
      toast.success("AI Crop advice compiled successfully!");
    }, 905);
  };

  const handleSchemes = (e: any) => {
    e.preventDefault();
    if (!land || isNaN(Number(land)) || Number(land) <= 0) {
      toast.error("Please enter a valid farm land size (in acres)");
      return;
    }
    setEligible({
      pmKisan: Number(land) <= 5 ? "Eligible (₹6,000 yearly verified under Satara smallholder status)" : "Ineligible (Exceeds size limits)",
      falybima: "Eligible (Subsidy coverage: 98% premium paid by Gov)"
    });
    toast.success("Scheme verification completed!");
  };

  const handleInsurance = (e: any) => {
    e.preventDefault();
    if (!insSurvey || !insCover) {
      toast.error("Please enter survey number and desired coverage amount");
      return;
    }
    if (!insFileUploaded) {
      toast.error("Please upload land document (7/12 Extract) before applying");
      return;
    }
    setInsResult({ policyNo: `PMFBY-${Date.now().toString().slice(-6)}`, premium: Number(insCover) * 0.02 });
    toast.success("Subsidized Crop Insurance successfully activated!");
  };

  const triggerUpload = () => {
    setInsProgress(0);
    const interval = setInterval(() => {
      setInsProgress(p => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(interval);
          setInsFileUploaded(true);
          toast.success("7/12 land extract successfully uploaded and verified!");
          return null;
        }
        return p + 25;
      });
    }, 150);
  };

  if (!selectedService) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 w-full">
        {[{ id: "crop-advice", title: "Crop Advice", desc: "Get AI based crop advisory" },
           { id: "market-prices", title: "Market Prices", desc: "Check regional mandi trends" },
           { id: "gov-schemes", title: "Gov Schemes", desc: "Eligibility checker Tool" },
           { id: "insurance", title: "Insurance", desc: "Subsidized crop insurance" }].map(s => (
          <button key={s.id} onClick={() => setSelectedService(s.id)} className="text-left bg-card hover:bg-secondary/40 border border-border p-5 rounded-2xl shadow-sm transition">
            <h4 className="font-bold text-primary text-base">{s.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            <span className="inline-block mt-3 text-xs font-semibold text-primary">Open Tool →</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <button onClick={() => { setSelectedService(null); setAdvice(null); setEligible(null); setInsResult(null); }} className="flex items-center gap-1.5 text-xs text-primary font-bold mr-auto bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-lg transition">
        <ArrowLeft className="size-3.5" /> Back to Services
      </button>

      {selectedService === "crop-advice" && (
        <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm max-w-xl mx-auto w-full">
          <h3 className="text-[17px] font-bold text-primary mb-3">AI Crop Adviser</h3>
          <form onSubmit={handleAdvice} className="flex flex-col gap-3">
            <select className="border border-border rounded-lg px-3 py-2 text-sm bg-white" value={crop} onChange={e=>setCrop(e.target.value)}>
              <option value="">-- Choose Crop --</option>
              <option value="Soybean">Soybean</option>
              <option value="Wheat">Wheat</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
            <select className="border border-border rounded-lg px-3 py-2 text-sm bg-white" value={stage} onChange={e=>setStage(e.target.value)}>
              <option value="">-- Choose Growth Stage --</option>
              <option value="Sowing">Sowing / Planting</option>
              <option value="Flowering">Flowering / Heading</option>
              <option value="Harvesting">Harvesting</option>
            </select>
            <textarea className="border border-border rounded-lg px-3 py-2 text-sm bg-white" placeholder="Describe symptoms or moisture conditions (optional)..." value={notes} onChange={e=>setNotes(e.target.value)} />
            <button type="submit" className="h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition text-sm">
              {adviceLoading ? "Compiling Advice..." : "Request AI Recommendation"}
            </button>
          </form>
          {advice && (
            <div className="mt-4 p-4 border border-border bg-accent/40 rounded-xl text-sm animate-fade-in">
              <h4 className="font-bold text-primary mb-1 text-[13px] flex items-center gap-1"><Info className="size-4" /> AI Advice Result</h4>
              <p className="text-foreground/90 text-xs leading-relaxed mt-1">{advice}</p>
            </div>
          )}
        </div>
      )}

      {selectedService === "market-prices" && (
        <RealMandiPricesView mounted={mounted} />
      )}

      {selectedService === "gov-schemes" && (
        <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm max-w-xl mx-auto w-full">
          <h3 className="text-[17px] font-bold text-primary mb-3">Subsidies Eligibility Verification</h3>
          <form onSubmit={handleSchemes} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">State Registry</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white font-medium" value={schemeState} onChange={e=>setSchemeState(e.target.value)}>
                <option value="Maharashtra">Maharashtra (Satara district)</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Farm Land Size (Acres)</label>
              <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" placeholder="e.g. 5.5" value={land} onChange={e=>setLand(e.target.value)} />
            </div>
            <button type="submit" className="h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 mt-2 transition text-sm">Check Scheme Eligibility</button>
          </form>
          {eligible && (
            <div className="mt-4 p-4 border border-border bg-accent/40 rounded-xl text-xs space-y-2 animate-fade-in">
              <p>🌾 <strong>PM-KISAN Status</strong>: {eligible.pmKisan}</p>
              <p>🛡️ <strong>PM Fasal Bima Status</strong>: {eligible.falybima}</p>
            </div>
          )}
        </div>
      )}

      {selectedService === "insurance" && (
        <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm max-w-xl mx-auto w-full">
          <h3 className="text-[17px] font-bold text-primary mb-3">Subsidized Crop Insurance Portal</h3>
          <form onSubmit={handleInsurance} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Land Survey Number</label>
              <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" placeholder="e.g. 24A/9" value={insSurvey} onChange={e=>setInsSurvey(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Desired Cover Amount (INR)</label>
              <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" placeholder="e.g. 50000" value={insCover} onChange={e=>setInsCover(e.target.value)} />
            </div>
            <div className="border border-dashed border-border rounded-xl p-4 text-center bg-accent/10">
              <UploadCloud className="size-8 mx-auto text-primary mb-2 animate-bounce" />
              <p className="text-xs font-bold text-foreground">Upload 7/12 Land Record Document</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Required to parse survey verification</p>
              {insProgress !== null && (
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
                  <div className="bg-primary h-full" style={{ width: `${insProgress}%` }}></div>
                </div>
              )}
              {insFileUploaded ? (
                <p className="text-xs text-green-600 font-semibold mt-2.5 flex items-center justify-center gap-1">✓ 7_12_extract.pdf successfully linked</p>
              ) : (
                <button type="button" onClick={triggerUpload} disabled={insProgress !== null} className="mt-3 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition">
                  {insProgress !== null ? `Scanning (${insProgress}%)` : "Simulate Document Verification"}
                </button>
              )}
            </div>
            <button type="submit" className="h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition text-sm">Submit Crop Policy Application</button>
          </form>
          {insResult && (
            <div className="mt-4 p-4 border border-border bg-green-50/50 text-[11px] rounded-xl flex flex-col gap-1 text-primary animate-fade-in">
              <p>📄 <strong>Insurance Policy Code</strong>: {insResult.policyNo}</p>
              <p>💰 <strong>Estimated Premium (2% subsidized rate)</strong>: ₹{insResult.premium} (direct DBT debit)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RealMandiPricesView({ mounted }: { mounted: boolean }) {
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Satara");
  const [commodity, setCommodity] = useState("All Commodities");
  const [arrivalDate, setArrivalDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [records, setRecords] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STATE_DISTRICTS: Record<string, string[]> = {
    "Maharashtra": ["Satara", "Pune", "Nashik", "Nagpur", "Kolhapur", "Solapur", "Latur", "Amravati", "Parbhani", "Sangli", "Aurangabad", "Ahmednagar", "Jalgaon", "Nanded", "Dhule", "Akola"],
    "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Gwalior", "Jabalpur", "Dewas", "Ratlam", "Mandsaur", "Sagar", "Dhar"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Sangrur", "Ferozepur", "Gurdaspur"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Junagadh", "Amreli", "Mehsana", "Bhavnagar", "Anand"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Alwar", "Ganganagar", "Churu", "Nagaur"],
    "Uttar Pradesh": ["Agra", "Kanpur", "Varanasi", "Lucknow", "Bareilly", "Mathura", "Aligarh", "Meerut", "Moradabad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Belagavi", "Davangere", "Ballari", "Shivamogga", "Tumakuru"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Erode", "Vellore", "Thanjavur"],
    "Andhra Pradesh": ["Guntur", "Vijayawada", "Visakhapatnam", "Kurnool", "Anantapur", "Kakinada", "Tirupati"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahbubnagar", "Nalgonda"],
    "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Panipat", "Yamunanagar", "Sonipat"],
    "Tripura": ["Dhalai", "North Tripura", "South Tripura", "West Tripura", "Gomati", "Khowai", "Sepahijala", "Unakoti"]
  };

  const COMMODITIES_LIST = [
    "All Commodities", "Soyabean", "Cotton", "Guar", "Wheat", "Rice", "Onion", "Tomato", "Potato", 
    "Maize", "Bengal Gram(Gram)(Whole)", "Jowar(Sorghum)", "Banana", "Sugarcane", "Paddy(Dhan)",
    "Bajra(Pearl Millet/Cumbu)", "Arhar (Tur/Red Gram)(Whole)", "Garlic", "Ginger(Green)", "Groundnut", "Chilli Red"
  ];

  const availableDistricts = state && STATE_DISTRICTS[state] ? ["All Districts", ...STATE_DISTRICTS[state]] : ["All Districts"];

  const fetchMandiPrices = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `http://localhost:5000/api/mandi-prices?limit=${limit}&offset=${offset}`;
      if (state && state !== "All States" && state !== "all") {
        url += `&state=${encodeURIComponent(state)}`;
      }
      if (district && district !== "All Districts" && district !== "all") {
        url += `&district=${encodeURIComponent(district)}`;
      }
      if (commodity && commodity !== "All Commodities" && commodity !== "all") {
        url += `&commodity=${encodeURIComponent(commodity)}`;
      }
      if (arrivalDate.trim()) {
        url += `&date=${encodeURIComponent(arrivalDate.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.status === "success") {
        setRecords(data.records || []);
        setTotalRecords(data.total || 0);
      } else {
        setError(data.message || "Failed to fetch mandi prices.");
      }
    } catch (err: any) {
      console.error("Mandi Prices fetch error:", err);
      setError(err.message || "Unable to load market price data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiPrices();
  }, [state, district, commodity, arrivalDate, offset]);

  const handleStateChange = (newState: string) => {
    setState(newState);
    setDistrict("All Districts");
    setOffset(0);
  };

  const handleResetFilters = () => {
    setState("Maharashtra");
    setDistrict("Satara");
    setCommodity("All Commodities");
    setArrivalDate("");
    setSearchQuery("");
    setOffset(0);
  };

  const filteredRecords = records.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.commodity && r.commodity.toLowerCase().includes(q)) ||
      (r.market && r.market.toLowerCase().includes(q)) ||
      (r.district && r.district.toLowerCase().includes(q)) ||
      (r.variety && r.variety.toLowerCase().includes(q))
    );
  });

  const validPrices = filteredRecords.map(r => Number(r.modal_price)).filter(p => !isNaN(p) && p > 0);
  const avgModalPrice = validPrices.length > 0 ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length) : 0;
  const maxPrice = filteredRecords.length > 0 ? Math.max(...filteredRecords.map(r => Number(r.max_price) || 0)) : 0;
  const minPrice = filteredRecords.length > 0 ? Math.min(...filteredRecords.map(r => Number(r.min_price) || 0).filter(p => p > 0)) : 0;

  const chartData = filteredRecords.slice(0, 10).map(r => ({
    name: r.commodity ? (r.commodity.length > 12 ? r.commodity.slice(0, 12) + "..." : r.commodity) : r.market,
    Modal: Number(r.modal_price) || 0,
    Min: Number(r.min_price) || 0,
    Max: Number(r.max_price) || 0,
    market: r.market
  }));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <h3 className="text-lg font-bold text-primary">Live Mandi Market Commodity Prices</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official Data Source: <strong>data.gov.in (AGMARKNET Government of India)</strong>
          </p>
        </div>
        <button
          onClick={handleResetFilters}
          className="self-start md:self-auto text-xs font-semibold px-3 py-1.5 border border-border rounded-lg bg-white hover:bg-secondary transition flex items-center gap-1.5 text-muted-foreground hover:text-primary"
        >
          <RotateCcw className="size-3.5" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-secondary/30 p-4 rounded-xl border border-border">
        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">State</label>
          <select
            className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            value={state}
            onChange={e => handleStateChange(e.target.value)}
          >
            <option value="All States">All States</option>
            {Object.keys(STATE_DISTRICTS).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">District</label>
          <select
            className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            value={district}
            onChange={e => { setDistrict(e.target.value); setOffset(0); }}
          >
            {availableDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Crop / Commodity</label>
          <select
            className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            value={commodity}
            onChange={e => { setCommodity(e.target.value); setOffset(0); }}
          >
            {COMMODITIES_LIST.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Arrival Date</label>
          <input
            type="text"
            placeholder="e.g. 08/08/2026"
            className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            value={arrivalDate}
            onChange={e => { setArrivalDate(e.target.value); setOffset(0); }}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Search Mandi / Crop</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search market or variety..."
              className="w-full border border-border rounded-lg pl-8 pr-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 border border-border bg-emerald-50/50 rounded-xl">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Avg Modal Price</p>
          <p className="text-xl font-black text-emerald-700 mt-1">₹{avgModalPrice > 0 ? avgModalPrice.toLocaleString("en-IN") : "--"} <span className="text-[10px] font-normal text-muted-foreground">/ Qtl</span></p>
        </div>
        <div className="p-3.5 border border-border bg-blue-50/50 rounded-xl">
          <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Highest Max Price</p>
          <p className="text-xl font-black text-blue-700 mt-1">₹{maxPrice > 0 ? maxPrice.toLocaleString("en-IN") : "--"} <span className="text-[10px] font-normal text-muted-foreground">/ Qtl</span></p>
        </div>
        <div className="p-3.5 border border-border bg-amber-50/50 rounded-xl">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Lowest Min Price</p>
          <p className="text-xl font-black text-amber-700 mt-1">₹{minPrice > 0 ? minPrice.toLocaleString("en-IN") : "--"} <span className="text-[10px] font-normal text-muted-foreground">/ Qtl</span></p>
        </div>
        <div className="p-3.5 border border-border bg-accent/20 rounded-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Records</p>
          <p className="text-xl font-black text-primary mt-1">{totalRecords.toLocaleString("en-IN")} <span className="text-[10px] font-normal text-muted-foreground">found</span></p>
        </div>
      </div>

      {mounted && !loading && chartData.length > 0 && (
        <div className="bg-white p-4 border border-border rounded-xl">
          <h4 className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5">
            <TrendingUp className="size-4 text-emerald-600" /> Real Mandi Commodity Price Comparison (₹ per Quintal)
          </h4>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")} / Quintal`]}
                />
                <Bar dataKey="Min" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Min Price" />
                <Bar dataKey="Modal" fill="#10b981" radius={[4, 4, 0, 0]} name="Modal Price" />
                <Bar dataKey="Max" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Max Price" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center border border-border rounded-xl bg-white space-y-3">
          <div className="inline-block size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-primary">Fetching live commodity market prices from data.gov.in...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-5 border border-red-200 bg-red-50 text-red-700 rounded-xl text-xs flex flex-col items-center gap-2">
          <p className="font-semibold">⚠️ {error}</p>
          <button
            onClick={fetchMandiPrices}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && filteredRecords.length === 0 && (
        <div className="p-8 text-center border border-border rounded-xl bg-white">
          <p className="text-sm font-bold text-muted-foreground">No mandi commodity prices found for selected filters.</p>
          <p className="text-xs text-muted-foreground mt-1">Try selecting "All Districts" or choosing a different state.</p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {!loading && !error && filteredRecords.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-border rounded-xl bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="p-3">State &amp; District</th>
                  <th className="p-3">Market (Mandi)</th>
                  <th className="p-3">Commodity / Crop</th>
                  <th className="p-3">Variety / Grade</th>
                  <th className="p-3 text-center">Arrival Date</th>
                  <th className="p-3 text-right">Min Price</th>
                  <th className="p-3 text-right">Max Price</th>
                  <th className="p-3 text-right font-black text-primary">Modal Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-accent/20 transition">
                    <td className="p-3">
                      <span className="font-bold text-foreground block">{r.state}</span>
                      <span className="text-[10px] text-muted-foreground">{r.district}</span>
                    </td>
                    <td className="p-3 font-semibold text-primary">{r.market}</td>
                    <td className="p-3 font-bold text-emerald-800">{r.commodity}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 bg-secondary rounded text-[10px] font-medium text-foreground">
                        {r.variety || "Local"} ({r.grade || "FAQ"})
                      </span>
                    </td>
                    <td className="p-3 text-center text-muted-foreground font-mono">{r.arrival_date}</td>
                    <td className="p-3 text-right font-medium text-amber-700">₹{Number(r.min_price).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right font-medium text-blue-700">₹{Number(r.max_price).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right font-black text-emerald-700 text-sm bg-emerald-50/40">
                      ₹{Number(r.modal_price).toLocaleString("en-IN")}
                      <span className="text-[9px] font-normal text-muted-foreground block">/ Qtl</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Showing <strong>{offset + 1}</strong> to <strong>{Math.min(offset + limit, totalRecords)}</strong> of <strong>{totalRecords.toLocaleString("en-IN")}</strong> records
            </p>
            <div className="flex gap-2">
              <button
                disabled={offset === 0 || loading}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold bg-white hover:bg-secondary disabled:opacity-50 transition"
              >
                ← Previous Page
              </button>
              <button
                disabled={offset + limit >= totalRecords || loading}
                onClick={() => setOffset(offset + limit)}
                className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold bg-white hover:bg-secondary disabled:opacity-50 transition"
              >
                Next Page →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


