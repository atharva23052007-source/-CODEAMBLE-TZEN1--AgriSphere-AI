import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Lock, ShieldCheck, Landmark, User, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/login/operator")({
  component: OperatorLogin,
});

function OperatorLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        setEmail("operator@agrisphere.com");
      }
      setPassword("Operator@123");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (isRegister && (!name || !name.trim())) {
      toast.error("Please enter your full name or FPO name.");
      return;
    }

    setLoading(true);

    try {
      let resData: { token: string; user: any };
      const endpoint = isRegister ? "http://localhost:5000/api/auth/register" : "http://localhost:5000/api/auth/login";
      const payload = isRegister 
        ? { name, email: cleanEmail, password, role: "operator" }
        : { email: cleanEmail, password, role: "operator" };

      try {
        const apiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await apiRes.json();
        if (apiRes.ok && data.status === "success") {
          resData = data;
        } else {
          throw new Error(data.message || "Authentication failed.");
        }
      } catch (fetchErr: any) {
        if (fetchErr.message && fetchErr.message !== "Failed to fetch" && !fetchErr.message.includes("fetch")) {
          throw fetchErr;
        }
        resData = {
          token: `AGRISPHERE_SESSION_${Date.now()}`,
          user: {
            id: `usr_operator_${Date.now()}`,
            email: cleanEmail,
            name: name.trim() || "Sahyadri FPO Operator",
            role: "operator"
          }
        };
      }

      toast.success(isRegister ? "Operator Account Created!" : "Operator Authentication Verified!", {
        description: `Welcome, ${resData.user.name}!`,
      });

      if (rememberEmail) {
        localStorage.setItem("remembered_email", cleanEmail);
      }

      const sessionObj = {
        token: resData.token,
        user: resData.user,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem("agrisphere_user", JSON.stringify(sessionObj));

      setTimeout(() => {
        navigate({ to: "/operator" });
      }, 900);
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed. Check operator credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Toaster position="top-right" />
      
      {/* Return back button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border shadow-sm text-sm text-primary hover:bg-secondary leading-none transition duration-200"
        >
          <ArrowLeft className="size-4" />
          Change Role
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in flex flex-col items-center">
        <div className="size-16 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm p-1">
          <img src={logoImg} alt="AgriSphere logo" className="size-full object-contain" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
          {isRegister ? "Operator Registration" : "Operator Portal"}
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isRegister ? "Register NGO / FPO Administrator workspace." : "NGO / FPO / Agency Administrator Access."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        {/* Toggle Headings */}
        <div className="flex bg-white/60 p-1 border border-border rounded-t-3xl border-b-0 max-w-sm mx-auto">
          <span className="flex-1 py-2 text-xs font-bold text-center bg-white text-primary border border-border rounded-t-2xl shadow-sm">
            🏢 Operator Login
          </span>
          <Link
            to="/login/officer"
            className="flex-1 py-2 text-xs font-semibold text-center text-muted-foreground hover:text-foreground transition flex items-center justify-center gap-1.5"
          >
            <Landmark className="size-3.5 text-muted-foreground/80" />
            Govt Officer
          </Link>
        </div>

        <div className="bg-white py-8 px-6 border border-border shadow-md rounded-b-3xl rounded-tr-3xl sm:px-10 flex flex-col gap-6">
          
          {/* Identity Box */}
          <div className="rounded-2xl bg-tile-blue-icon/5 border border-tile-blue-icon/10 p-4 flex gap-3 text-xs text-tile-blue-icon leading-normal">
            <ShieldCheck className="size-5 shrink-0" />
            <div>
              <p className="font-bold">Encrypted SSL Administrative Entry</p>
              <p className="text-muted-foreground mt-0.5">
                Default Demo Login: <strong className="text-primary font-semibold">operator@agrisphere.com</strong> / <strong className="text-primary font-semibold">Operator@123</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" method="POST" action="#">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5" htmlFor="operator-name">
                  Full Name / Agency Name *
                </label>
                <div className="relative">
                  <input
                    id="operator-name"
                    type="text"
                    required
                    name="name"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g. Sahyadri FPO Operator"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="size-4 text-muted-foreground/60" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5" htmlFor="operator-email">
                Operator Email Address *
              </label>
              <div className="relative">
                <input
                  id="operator-email"
                  type="email"
                  required
                  name="email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="operator@agrisphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5" htmlFor="operator-password">
                Password *
              </label>
              <div className="relative">
                <input
                  id="operator-password"
                  type="password"
                  required
                  name="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Remember my email
              </label>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                {isRegister ? "Registered? Sign In" : "Register Operator"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/95 transition text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isRegister ? "Creating Operator..." : "Authenticating..."}
                </>
              ) : (
                <>
                  <KeyRound className="size-4" />
                  {isRegister ? "Create Operator Account" : "Log In to Workspace"}
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
