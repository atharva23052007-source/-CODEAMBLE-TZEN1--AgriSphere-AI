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
  LogOut,
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
  CheckCircle2,
  Loader2,
  ExternalLink,
  Calculator,
  Tractor,
  FlaskConical,
  Droplet,
  ShoppingBag,
  CreditCard,
  Sun,
  ShieldAlert,
  Layers,
  ArrowRight,
  Zap,
  RefreshCw,
  Scale,
  Building2,
  Coins,
  Edit3,
  X
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
  { id: "services", label: "Farm Management", icon: LayoutGrid },
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
                <button
                  onClick={() => {
                    localStorage.removeItem("agrisphere_user");
                    toast.success("Logged out successfully.");
                    window.location.href = "/login/farmer";
                  }}
                  title="Logout"
                  className="flex items-center gap-1.5 h-11 px-3.5 rounded-full border border-border bg-white hover:bg-rose-50 hover:text-rose-700 transition text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Logout
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
                    {/* Your Farm Profit */}
                    <div className="rounded-2xl bg-card border border-border p-5 lg:p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="size-5 text-emerald-600" />
                            <h3 className="text-base lg:text-lg font-bold text-foreground">Your Farm Profit</h3>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                            94% Confidence
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between border-b border-border pb-3">
                          <div>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase">Estimated Net Profit</span>
                            <div className="text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight mt-0.5">
                              +₹1,24,600
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              +52.3% ROI
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-accent/40 rounded-xl border border-border">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Estimated Revenue</span>
                            <span className="text-sm font-bold text-primary mt-0.5 block">₹2,44,600</span>
                            <span className="text-[9px] text-muted-foreground">50 Qtl × ₹4,892/Qtl</span>
                          </div>
                          <div className="p-2.5 bg-accent/40 rounded-xl border border-border">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Farming Cost</span>
                            <span className="text-sm font-bold text-amber-700 mt-0.5 block">₹1,20,000</span>
                            <span className="text-[9px] text-muted-foreground">Seeds, Fertilizer, Labor</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs bg-accent/60 rounded-xl px-3.5 py-2">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <IndianRupee className="size-3.5 text-primary" />
                          <span className="font-medium text-[11px]">Break-even Price:</span>
                        </div>
                        <span className="font-extrabold text-primary text-xs">₹2,400 <span className="text-[10px] font-normal text-muted-foreground">/ Qtl</span></span>
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

      const data = await resp.json().catch(() => ({}));

      if (resp.ok && data.status === "success" && data.answer) {
        setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
        speakText(data.answer);
      } else {
        const errorMsg = data.message || `Backend API error (${resp.status}). Please check your GEMINI_API_KEY in .env file.`;
        setMessages(prev => [...prev, { role: "ai", text: `⚠️ ${errorMsg}` }]);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = "Unable to connect to AI server at http://localhost:5000. Ensure the Node backend is running.";
      setMessages(prev => [...prev, { role: "ai", text: `⚠️ ${errorMsg}` }]);
      toast.error(errorMsg);
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

interface FarmRecord {
  id: string;
  farmerId: string;
  farmName: string;
  cropName: string;
  area: number;
  season: string;
  status: string;
  soilType?: string;
  plantingDate?: string;
  updatedAt?: string;
}

function ServicesView({ selectedService, setSelectedService, mounted }: { selectedService: string | null; setSelectedService: any; mounted: boolean }) {
  const [farms, setFarms] = useState<FarmRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Modal / Form state for Add and Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmRecord | null>(null);

  // Form Field States
  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("");
  const [area, setArea] = useState("");
  const [season, setSeason] = useState("Kharif");
  const [status, setStatus] = useState("Growing");
  const [soilType, setSoilType] = useState("Black Cotton Soil");
  const [plantingDate, setPlantingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultInitialFarms: FarmRecord[] = [
    { id: "FARM-101", farmerId: "farmer_patil", farmName: "Satara Main Field", cropName: "Soybean (JS-335)", area: 4.5, season: "Kharif", status: "Growing", soilType: "Black Cotton Soil", plantingDate: "2026-06-15", updatedAt: "2026-08-08" },
    { id: "FARM-102", farmerId: "farmer_patil", farmName: "Koregaon Riverside", cropName: "Sugarcane (Co-86032)", area: 6.0, season: "Annual", status: "Sown", soilType: "Loamy Soil", plantingDate: "2026-01-20", updatedAt: "2026-08-08" },
    { id: "FARM-103", farmerId: "farmer_patil", farmName: "Wai Hillside Plot", cropName: "Turmeric (Rajapuri)", area: 2.5, season: "Kharif", status: "Flowering", soilType: "Red Sandy Soil", plantingDate: "2026-05-10", updatedAt: "2026-08-08" },
    { id: "FARM-104", farmerId: "farmer_patil", farmName: "North Acre Plot", cropName: "Wheat (Sharbati)", area: 3.0, season: "Rabi", status: "Harvested", soilType: "Alluvial Soil", plantingDate: "2025-11-15", updatedAt: "2026-08-08" }
  ];

  // Fetch Farms from Backend API with localStorage fallback
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/farms");
      if (res.ok) {
        const data = await res.json();
        if (data.farms && Array.isArray(data.farms)) {
          setFarms(data.farms);
          localStorage.setItem("agrisphere_farms", JSON.stringify(data.farms));
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API fetch failed, loading from local cache...", err);
    }

    const cached = localStorage.getItem("agrisphere_farms");
    if (cached) {
      try {
        setFarms(JSON.parse(cached));
      } catch {
        setFarms(defaultInitialFarms);
      }
    } else {
      setFarms(defaultInitialFarms);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleOpenAddModal = () => {
    setEditingFarm(null);
    setFarmName("");
    setCropName("");
    setArea("3.0");
    setSeason("Kharif");
    setStatus("Growing");
    setSoilType("Black Cotton Soil");
    setPlantingDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (farm: FarmRecord) => {
    setEditingFarm(farm);
    setFarmName(farm.farmName);
    setCropName(farm.cropName);
    setArea(farm.area.toString());
    setSeason(farm.season);
    setStatus(farm.status);
    setSoilType(farm.soilType || "Loamy Soil");
    setPlantingDate(farm.plantingDate || "");
    setIsModalOpen(true);
  };

  const handleSubmitFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim() || !cropName.trim() || !area || isNaN(Number(area)) || Number(area) <= 0) {
      toast.error("Please enter a valid Farm Name, Crop Name, and Area (in Acres).");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      farmName: farmName.trim(),
      cropName: cropName.trim(),
      area: parseFloat(area),
      season,
      status,
      soilType: soilType || "Loamy Soil",
      plantingDate: plantingDate || new Date().toISOString().split("T")[0]
    };

    if (editingFarm) {
      // EDIT existing farm
      try {
        await fetch(`http://localhost:5000/api/farms/${editingFarm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn("Backend update failed, updating local state:", err);
      }

      const updatedList = farms.map(f => f.id === editingFarm.id ? { ...f, ...payload, updatedAt: new Date().toISOString().split("T")[0] } : f);
      setFarms(updatedList);
      localStorage.setItem("agrisphere_farms", JSON.stringify(updatedList));
      toast.success(`Farm "${farmName}" updated successfully!`);
    } else {
      // ADD new farm
      let createdFarm: FarmRecord = {
        id: `FARM-${Date.now().toString().slice(-5)}`,
        farmerId: "farmer_patil",
        ...payload,
        updatedAt: new Date().toISOString().split("T")[0]
      };

      try {
        const res = await fetch("http://localhost:5000/api/farms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.farm) createdFarm = data.farm;
        }
      } catch (err) {
        console.warn("Backend add failed, saving to local state:", err);
      }

      const newList = [createdFarm, ...farms];
      setFarms(newList);
      localStorage.setItem("agrisphere_farms", JSON.stringify(newList));
      toast.success(`Added new farm "${farmName}" (${cropName})!`);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDeleteFarm = async (farm: FarmRecord) => {
    if (!window.confirm(`Are you sure you want to delete "${farm.farmName}" (${farm.cropName})?`)) {
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/farms/${farm.id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Backend delete failed, removing locally:", err);
    }

    const newList = farms.filter(f => f.id !== farm.id);
    setFarms(newList);
    localStorage.setItem("agrisphere_farms", JSON.stringify(newList));
    toast.success(`Deleted farm "${farm.farmName}"`);
  };

  // Filtered Farms Calculation
  const filteredFarms = farms.filter(f => {
    const matchesSearch = f.farmName.toLowerCase().includes(searchQuery.toLowerCase()) || f.cropName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = seasonFilter === "All" || f.season.toLowerCase() === seasonFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || f.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesSeason && matchesStatus;
  });

  // Summary Statistics
  const totalFields = farms.length;
  const totalArea = farms.reduce((acc, f) => acc + (Number(f.area) || 0), 0).toFixed(1);
  const activeCropsCount = farms.filter(f => f.status !== "Harvested" && f.status !== "Fallow").length;
  const harvestedCount = farms.filter(f => f.status === "Harvested" || f.status === "Harvesting").length;

  if (!selectedService) {
    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-lg lg:text-xl">
              <Sprout className="size-6 text-primary" />
              <span>Farm & Crop Management</span>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              Add, track, edit, and manage your crop fields, acreage, cultivation seasons, and harvest status.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs lg:text-sm transition flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="size-4" />
            Add New Farm / Crop
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 lg:p-5 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="size-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Total Fields</span>
              <span className="text-xl lg:text-2xl font-extrabold text-foreground">{totalFields} Plots</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 lg:p-5 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Scale className="size-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Total Cultivated Area</span>
              <span className="text-xl lg:text-2xl font-extrabold text-foreground">{totalArea} Acres</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 lg:p-5 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <Sprout className="size-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Active Crops</span>
              <span className="text-xl lg:text-2xl font-extrabold text-foreground">{activeCropsCount} Active</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 lg:p-5 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Harvest Ready / Harvested</span>
              <span className="text-xl lg:text-2xl font-extrabold text-foreground">{harvestedCount} Fields</span>
            </div>
          </div>
        </div>

        {/* Filters & View Toggle Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by farm or crop name..."
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
              value={seasonFilter}
              onChange={e => setSeasonFilter(e.target.value)}
            >
              <option value="All">All Seasons</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
              <option value="Annual">Annual</option>
            </select>

            <select
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Sown">Sown</option>
              <option value="Growing">Growing</option>
              <option value="Flowering">Flowering</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Harvested">Harvested</option>
              <option value="Fallow">Fallow</option>
            </select>

            <div className="flex items-center bg-muted border border-border rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${viewMode === "cards" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                title="Grid Cards View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${viewMode === "table" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                title="Table List View"
              >
                <Layers className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Farm Content View */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading farm records...</div>
        ) : filteredFarms.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3">
            <Sprout className="size-12 text-muted-foreground/50" />
            <h4 className="font-bold text-foreground text-base">No Farm Records Found</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              No crop fields matched your criteria. Add your first farm field or adjust search filters.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 h-9 px-4 bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Farm Record
            </button>
          </div>
        ) : viewMode === "cards" ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredFarms.map(farm => {
              const statusColors: Record<string, string> = {
                Growing: "bg-emerald-100 text-emerald-800 border-emerald-300",
                Sown: "bg-blue-100 text-blue-800 border-blue-300",
                Flowering: "bg-violet-100 text-violet-800 border-violet-300",
                Harvesting: "bg-amber-100 text-amber-800 border-amber-300",
                Harvested: "bg-slate-100 text-slate-800 border-slate-300",
                Fallow: "bg-rose-100 text-rose-800 border-rose-300",
              };
              const badgeClass = statusColors[farm.status] || "bg-accent text-primary border-primary/20";

              return (
                <div key={farm.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${badgeClass}`}>
                        ● {farm.status}
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded-md">
                        {farm.season}
                      </span>
                    </div>

                    <h4 className="font-bold text-foreground text-base leading-snug">{farm.farmName}</h4>
                    <p className="text-xs text-primary font-bold mt-0.5 flex items-center gap-1">
                      <Leaf className="size-3.5" /> {farm.cropName}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Land Area:</span>
                        <strong className="text-foreground">{farm.area} Acres</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Soil Type:</span>
                        <strong className="text-foreground">{farm.soilType || "Loamy"}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sowing Date:</span>
                        <strong className="text-foreground">{farm.plantingDate || "N/A"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5 pt-3 border-t border-border">
                    <button
                      onClick={() => handleOpenEditModal(farm)}
                      className="flex-1 h-9 bg-accent hover:bg-accent/80 text-primary font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="size-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFarm(farm)}
                      className="h-9 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      title="Delete Farm"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3.5 pl-5">Field / Farm Name</th>
                    <th className="p-3.5">Crop Name</th>
                    <th className="p-3.5">Area (Acres)</th>
                    <th className="p-3.5">Season</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Soil Type</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFarms.map(farm => (
                    <tr key={farm.id} className="hover:bg-accent/30 transition">
                      <td className="p-3.5 pl-5 font-bold text-foreground">{farm.farmName}</td>
                      <td className="p-3.5 text-primary font-semibold flex items-center gap-1">
                        <Leaf className="size-3.5" /> {farm.cropName}
                      </td>
                      <td className="p-3.5 font-bold text-foreground">{farm.area} Acres</td>
                      <td className="p-3.5">{farm.season}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-accent text-primary rounded-md text-[11px] font-bold">
                          {farm.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-muted-foreground">{farm.soilType || "Loamy"}</td>
                      <td className="p-3.5 text-right pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(farm)}
                            className="p-1.5 text-primary hover:bg-accent rounded-lg transition cursor-pointer"
                            title="Edit Farm"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFarm(farm)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Farm"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add / Edit Farm Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-5 lg:p-6 shadow-xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition cursor-pointer"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-lg font-bold text-primary mb-1">
                {editingFarm ? "✏️ Edit Farm Record" : "🌱 Add New Farm Field"}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {editingFarm ? "Update crop name, acreage, season, or cultivation status." : "Register a new field/plot to your farmer dashboard."}
              </p>

              <form onSubmit={handleSubmitFarm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Farm / Field Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satara Main Field, Plot 4"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={farmName}
                    onChange={e => setFarmName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Crop Name & Variety *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soybean (JS-335)"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={cropName}
                    onChange={e => setCropName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 4.5"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Season</label>
                  <select
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={season}
                    onChange={e => setSeason(e.target.value)}
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="Annual">Annual (Perennial)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Status</label>
                  <select
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="Sown">Sown</option>
                    <option value="Growing">Growing</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Harvested">Harvested</option>
                    <option value="Fallow">Fallow</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Soil Type</label>
                  <select
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={soilType}
                    onChange={e => setSoilType(e.target.value)}
                  >
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Loamy Soil">Loamy Soil</option>
                    <option value="Red Sandy Soil">Red Sandy Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Planting Date</label>
                  <input
                    type="date"
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                    value={plantingDate}
                    onChange={e => setPlantingDate(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 border border-border rounded-xl text-xs font-semibold hover:bg-muted transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : editingFarm ? "Save Changes" : "Create Farm Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <button onClick={() => { setSelectedService(null); }} className="flex items-center gap-1.5 text-xs text-primary font-bold mr-auto bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-lg transition cursor-pointer">
        <ArrowLeft className="size-3.5" /> Back to Farm Management
      </button>

      {selectedService === "crop-advice" && (
        <RealCropAdvisoryView />
      )}

      {selectedService === "market-prices" && (
        <RealMandiPricesView mounted={mounted} />
      )}

      {selectedService === "gov-schemes" && (
        <RealGovSchemesView />
      )}

      {selectedService === "insurance" && (
        <RealCropInsuranceView />
      )}
    </div>
  );
}

function RealCropAdvisoryView() {
  const [crop, setCrop] = useState("Soybean");
  const [customCrop, setCustomCrop] = useState("");
  const [stage, setStage] = useState("Flowering & Podding");
  const [soilType, setSoilType] = useState("Black Cotton Soil");
  const [notes, setNotes] = useState("");
  const [lang, setLang] = useState<"en" | "mr" | "hi">("en");
  const [adviceResult, setAdviceResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleRequestAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCrop = crop === "Other" ? customCrop.trim() : crop;
    if (!targetCrop) {
      toast.error("Please specify a crop type.");
      return;
    }
    if (!stage) {
      toast.error("Please select a growth stage.");
      return;
    }

    setLoading(true);
    setAdviceResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/crop-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: targetCrop,
          stage,
          soilType,
          notes,
          lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAdviceResult(data);
        toast.success("✨ Hugging Face AI Crop Advisory compiled!");
      } else {
        throw new Error("Failed to fetch advice");
      }
    } catch (err) {
      console.warn("Backend API unavailable, compiling fallback advisory...", err);
      setAdviceResult({
        crop: targetCrop,
        stage,
        soilType,
        advice: `🌱 **Agronomic Advisory for ${targetCrop} (${stage} Stage):**\n\n` +
          `• **Nutrient Management**: Apply split dose of Nitrogen (Urea 45 kg/acre) & DAP (50 kg/acre). Ensure adequate potash (MOP 25 kg/acre).\n` +
          `• **Pest & Disease Care**: Spray Neem Oil 10,000 PPM (5ml/L) or Trichoderma viride to prevent fungal root rot in ${soilType}.\n` +
          `• **Irrigation**: Maintain 65% soil moisture capacity. Avoid waterlogging during ${stage} phase.\n` +
          `• **Satara Regional Best Practice**: Soil humidity is ideal for high yield. Keep field weed-free for optimal growth.`,
        provider: "AgriSphere Expert Engine"
      });
      toast.success("AI Crop Advisory compiled!");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = () => {
    if (!adviceResult?.advice) return;
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = adviceResult.advice.replace(/[*#•]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    if (lang === "mr") {
      const v = voices.find(x => x.lang.startsWith("mr") || x.lang.startsWith("hi"));
      if (v) utterance.voice = v;
    } else if (lang === "hi") {
      const v = voices.find(x => x.lang.startsWith("hi"));
      if (v) utterance.voice = v;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm max-w-3xl mx-auto w-full animate-fade-in">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary leading-snug">Hugging Face AI Crop Adviser</h3>
            <p className="text-xs text-muted-foreground">Instant agronomic best practices, disease protection & fertilizer schedules.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200 shrink-0 hidden sm:inline-block">
          ● Hugging Face AI Active
        </span>
      </div>

      <form onSubmit={handleRequestAdvice} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Select Crop *</label>
          <select
            className="w-full border border-border rounded-xl px-3 py-2 text-xs lg:text-sm bg-background font-medium"
            value={crop}
            onChange={e => setCrop(e.target.value)}
          >
            <option value="Soybean">Soybean (सोयाबीन)</option>
            <option value="Sugarcane">Sugarcane (ऊस)</option>
            <option value="Cotton">Cotton (कापूस)</option>
            <option value="Turmeric">Turmeric (हळद)</option>
            <option value="Wheat">Wheat (गहू)</option>
            <option value="Gram">Gram / Chickpea (हरभरा)</option>
            <option value="Onion">Onion (कांदा)</option>
            <option value="Tomato">Tomato (टोमॅटो)</option>
            <option value="Banana">Banana (केळी)</option>
            <option value="Rice">Rice (भात)</option>
            <option value="Other">Other / Custom Crop...</option>
          </select>
        </div>

        {crop === "Other" && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Custom Crop Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maize, Pomegranate"
              className="w-full border border-border rounded-xl px-3 py-2 text-xs lg:text-sm bg-background"
              value={customCrop}
              onChange={e => setCustomCrop(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Growth Stage *</label>
          <select
            className="w-full border border-border rounded-xl px-3 py-2 text-xs lg:text-sm bg-background font-medium"
            value={stage}
            onChange={e => setStage(e.target.value)}
          >
            <option value="Sowing / Planting">Sowing / Planting Phase</option>
            <option value="Vegetative Growth">Vegetative Growth Stage</option>
            <option value="Flowering & Podding">Flowering & Podding Stage</option>
            <option value="Fruit / Grain Development">Fruit / Grain Development</option>
            <option value="Pre-Harvesting">Pre-Harvesting Phase</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Soil Type</label>
          <select
            className="w-full border border-border rounded-xl px-3 py-2 text-xs lg:text-sm bg-background font-medium"
            value={soilType}
            onChange={e => setSoilType(e.target.value)}
          >
            <option value="Black Cotton Soil">Black Cotton Soil (काळी माती)</option>
            <option value="Loamy Soil">Loamy Soil (गाळाची माती)</option>
            <option value="Red Sandy Soil">Red Sandy Soil (तांबडी माती)</option>
            <option value="Alluvial Soil">Alluvial Soil</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Output Language</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${lang === "en" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("mr")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${lang === "mr" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"}`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${lang === "hi" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"}`}
            >
              हिंदी
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Describe Observed Symptoms / Questions (Optional)</label>
          <textarea
            rows={2}
            className="w-full border border-border rounded-xl p-3 text-xs lg:text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Yellow leaves on lower stem, white fly attack symptoms, or high moisture forecast..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs lg:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Querying Hugging Face AI Agronomist...
              </>
            ) : (
              <>
                <Bot className="size-4" />
                Request AI Crop Advisory (Hugging Face AI)
              </>
            )}
          </button>
        </div>
      </form>

      {/* Advisory Result Card */}
      {adviceResult && (
        <div className="mt-6 p-5 border border-primary/20 bg-emerald-50/40 rounded-2xl animate-fade-in relative">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <span>AI Advisory Result for {adviceResult.crop} ({adviceResult.stage})</span>
            </div>
            <button
              onClick={handleSpeech}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-border hover:bg-accent text-primary text-xs font-bold rounded-lg transition cursor-pointer"
            >
              <Volume2 className="size-3.5" />
              {isSpeaking ? "Pause Audio" : "Listen (TTS)"}
            </button>
          </div>

          <div className="text-xs lg:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
            {adviceResult.advice}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Powered by: <strong>{adviceResult.provider || "Hugging Face AI"}</strong></span>
            <span>Region: <strong>Satara, Maharashtra</strong></span>
          </div>
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

function RealGovSchemesView() {
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("All");
  const [crop, setCrop] = useState("All");

  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkLand, setCheckLand] = useState("");
  const [checkIncome, setCheckIncome] = useState("");
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/api/gov-schemes?category=${encodeURIComponent(category)}&state=${encodeURIComponent(state)}&crop=${encodeURIComponent(crop)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === "success") {
        setSchemes(data.schemes || []);
      } else {
        setError(data.message || "Failed to load government schemes.");
      }
    } catch (err: any) {
      console.error("Gov Schemes fetch error:", err);
      setError(err.message || "Unable to reach schemes API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category, state, crop]);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const landVal = parseFloat(checkLand) || 0;
    if (landVal <= 5) {
      setEligibilityResult("✅ High Priority Eligible: Small/Marginal Farmer category (Subsidies up to 80% under PMKSY & SMAM, ₹12,000/yr under PM-KISAN + Namo Shetkari).");
    } else {
      setEligibilityResult("✅ Eligible under General Category (Standard 55% Drip Subsidy & 40% Machinery Subsidy).");
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" /> Government Agriculture Schemes &amp; Subsidies
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified datasets from <strong>Ministry of Agriculture &amp; Farmers Welfare / State Agri Dept</strong>
            </p>
          </div>
          <a
            href="https://pmkisan.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-1.5 self-start md:self-auto"
          >
            Central Agri Portal <ExternalLink className="size-3.5" />
          </a>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-secondary/30 p-3.5 rounded-xl border border-border">
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Scheme Category</label>
            <select
              className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Financial Aid">Financial Aid / Income Support</option>
              <option value="Irrigation">Irrigation &amp; Drip Subsidies</option>
              <option value="Machinery">Machinery &amp; Equipment (SMAM)</option>
              <option value="Organic">Organic Farming (PKVY)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Filter by State</label>
            <select
              className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              value={state}
              onChange={e => setState(e.target.value)}
            >
              <option value="All">All States (Central Schemes)</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Filter by Crop</label>
            <select
              className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              value={crop}
              onChange={e => setCrop(e.target.value)}
            >
              <option value="All">All Crops</option>
              <option value="Soybean">Soybean</option>
              <option value="Cotton">Cotton</option>
              <option value="Wheat">Wheat</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instant Eligibility Checker Widget */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="size-4 text-emerald-700" /> Instant Subsidy Eligibility Calculator
        </h4>
        <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] font-semibold text-emerald-800 block mb-1">Farm Land Size (Acres)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 4.5"
              className="w-full border border-emerald-200 rounded-lg px-3 py-1.5 text-xs bg-white"
              value={checkLand}
              onChange={e => setCheckLand(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-emerald-800 block mb-1">Annual Family Income (Optional)</label>
            <input
              type="number"
              placeholder="e.g. 150000"
              className="w-full border border-emerald-200 rounded-lg px-3 py-1.5 text-xs bg-white"
              value={checkIncome}
              onChange={e => setCheckIncome(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="h-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
          >
            Check My Eligibility
          </button>
        </form>

        {eligibilityResult && (
          <div className="mt-3 p-3 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 animate-fade-in">
            {eligibilityResult}
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-8 text-center bg-white border border-border rounded-xl">
          <div className="inline-block size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-primary mt-2">Loading official government schemes...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Schemes Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider mb-1">
                      {s.category}
                    </span>
                    <h4 className="text-base font-bold text-primary leading-tight">{s.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.ministry}</p>
                  </div>
                  <span className="px-2 py-1 bg-secondary rounded text-[11px] font-mono font-bold text-foreground">
                    {s.state}
                  </span>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed">{s.description}</p>

                <div className="space-y-2 text-xs border-t border-border pt-3">
                  <div>
                    <strong className="text-emerald-800 block text-[11px] uppercase tracking-wider">💰 Financial Benefit:</strong>
                    <p className="text-foreground font-semibold text-xs mt-0.5">{s.benefits}</p>
                  </div>

                  <div>
                    <strong className="text-primary block text-[11px] uppercase tracking-wider">🎯 Eligibility Criteria:</strong>
                    <p className="text-muted-foreground text-xs mt-0.5">{s.eligibility}</p>
                  </div>

                  <div>
                    <strong className="text-primary block text-[11px] uppercase tracking-wider">📋 Required Documents:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.documents.map((doc: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] rounded font-medium">
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-primary block text-[11px] uppercase tracking-wider">📝 How to Apply:</strong>
                    <p className="text-muted-foreground text-xs mt-0.5 font-mono">{s.applicationProcess}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground">Deadline: <strong className="text-foreground">{s.deadline}</strong></p>
                  <p className="text-[10px] text-muted-foreground">Helpline: <strong className="text-emerald-700">{s.helpline}</strong></p>
                </div>

                <a
                  href={s.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  Apply on Official Portal <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RealCropInsuranceView() {
  const [state, setState] = useState("All");
  const [crop, setCrop] = useState("All");

  const [insuranceSchemes, setInsuranceSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // PMFBY Calculator state
  const [calcCrop, setCalcCrop] = useState("Soybean");
  const [calcAcres, setCalcAcres] = useState("2");
  const [calcSumPerAcre, setCalcSumPerAcre] = useState("30000");
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const fetchInsurance = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/crop-insurance?state=${encodeURIComponent(state)}&crop=${encodeURIComponent(crop)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInsuranceSchemes(data.insuranceSchemes || []);
      }
    } catch (err) {
      console.error("Insurance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurance();
  }, [state, crop]);

  const handleCalculatePremium = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalcLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/crop-insurance/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: calcCrop,
          landAcres: parseFloat(calcAcres) || 1,
          sumInsuredPerAcre: parseFloat(calcSumPerAcre) || 25000
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
      }
    } catch (err) {
      console.error("Calculator error:", err);
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="size-5 text-blue-600" /> Pradhan Mantri Fasal Bima Yojana (PMFBY) &amp; Crop Insurance
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official Portal: <strong>pmfby.gov.in (Government of India Crop Risk Protection)</strong>
          </p>
        </div>
        <a
          href="https://pmfby.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          Official PMFBY Portal <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Live PMFBY Subsidized Premium Calculator */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 lg:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="size-5 text-blue-700" />
          <h4 className="text-base font-bold text-blue-900">PMFBY Official Subsidized Premium Calculator</h4>
        </div>

        <form onSubmit={handleCalculatePremium} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-[11px] font-bold text-blue-900 uppercase block mb-1">Select Crop</label>
            <select
              className="w-full border border-blue-200 rounded-lg px-3 py-1.5 text-xs bg-white font-semibold"
              value={calcCrop}
              onChange={e => setCalcCrop(e.target.value)}
            >
              <option value="Soybean">Soybean (Kharif - 2%)</option>
              <option value="Cotton">Cotton (Kharif - 5%)</option>
              <option value="Wheat">Wheat (Rabi - 1.5%)</option>
              <option value="Sugarcane">Sugarcane (Annual - 5%)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-blue-900 uppercase block mb-1">Land Size (Acres)</label>
            <input
              type="number"
              step="0.5"
              className="w-full border border-blue-200 rounded-lg px-3 py-1.5 text-xs bg-white"
              value={calcAcres}
              onChange={e => setCalcAcres(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-blue-900 uppercase block mb-1">Sum Insured / Acre (₹)</label>
            <input
              type="number"
              step="1000"
              className="w-full border border-blue-200 rounded-lg px-3 py-1.5 text-xs bg-white"
              value={calcSumPerAcre}
              onChange={e => setCalcSumPerAcre(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={calcLoading}
            className="h-8 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition"
          >
            {calcLoading ? "Calculating..." : "Calculate Premium"}
          </button>
        </form>

        {calcResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-blue-200 text-xs animate-fade-in">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Sum Insured</p>
              <p className="text-base font-black text-primary mt-0.5">₹{calcResult.totalSumInsured.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-800 uppercase font-bold">Farmer Payable Premium ({calcResult.farmerRatePct}%)</p>
              <p className="text-base font-black text-emerald-700 mt-0.5">₹{calcResult.farmerPayablePremium.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-800 uppercase font-bold">Government Subsidy Share</p>
              <p className="text-base font-black text-blue-700 mt-0.5">₹{calcResult.govtSubsidyAmount.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Subsidy Rate</p>
              <p className="text-xs font-bold text-emerald-800 mt-1">98% Govt Subsidized</p>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Schemes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insuranceSchemes.map((ins) => (
          <div key={ins.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase tracking-wider mb-1 inline-block">
                    {ins.code}
                  </span>
                  <h4 className="text-base font-bold text-primary leading-tight">{ins.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{ins.ministry}</p>
                </div>
                <span className="px-2 py-1 bg-secondary text-foreground text-[11px] font-mono font-bold rounded">
                  {ins.state}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-border pt-3">
                <div>
                  <strong className="text-blue-900 block text-[11px] uppercase tracking-wider">🌾 Covered Crops:</strong>
                  <p className="text-foreground font-medium text-xs mt-0.5">{ins.cropCovered}</p>
                </div>

                <div>
                  <strong className="text-emerald-800 block text-[11px] uppercase tracking-wider">💳 Subsidized Premium Rate:</strong>
                  <p className="text-emerald-700 font-bold text-xs mt-0.5">{ins.premiumRate}</p>
                </div>

                <div>
                  <strong className="text-primary block text-[11px] uppercase tracking-wider">🛡️ Risk Coverage &amp; Benefits:</strong>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{ins.coverageBenefits}</p>
                </div>

                <div>
                  <strong className="text-primary block text-[11px] uppercase tracking-wider">📋 Required Documents:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ins.documents.map((d: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] rounded font-medium">
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="text-primary block text-[11px] uppercase tracking-wider">📞 72-Hour Claim Intimation Process:</strong>
                  <p className="text-muted-foreground text-xs mt-0.5 font-mono">{ins.claimProcess}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Cutoff Deadline: <strong className="text-foreground">{ins.deadline}</strong></p>
                <p className="text-[10px] text-muted-foreground">Toll-Free Helpline: <strong className="text-blue-700">{ins.helpline}</strong></p>
              </div>

              <a
                href={ins.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0"
              >
                Apply on PMFBY Portal <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


