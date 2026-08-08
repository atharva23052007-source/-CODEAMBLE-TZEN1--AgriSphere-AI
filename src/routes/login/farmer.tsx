import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Lock, ShieldCheck, User, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";
import { storeLoginUser, storeRegisterUser } from "../../lib/mongodb";

export const Route = createFileRoute("/login/farmer")({
  component: FarmerLogin,
});

function FarmerLogin() {
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
        setEmail("farmer@agrisphere.com");
      }
      setPassword("Farmer@123");
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
      toast.error("Please enter your full name to register.");
      return;
    }

    setLoading(true);

    try {
      let resData: { token: string; user: any };

      if (isRegister) {
        // Registration Flow
        try {
          const apiRes = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email: cleanEmail, password, role: "farmer" })
          });
          if (apiRes.ok) {
            resData = await apiRes.json();
          } else {
            const errData = await apiRes.json();
            throw new Error(errData.message || "Registration failed");
          }
        } catch (err) {
          resData = await storeRegisterUser({ name, email: cleanEmail, password, role: "farmer" });
        }

        toast.success("Account Created Successfully!", {
          description: `Welcome to AgriSphere AI, ${resData.user.name}!`,
        });
      } else {
        // Login Flow
        try {
          const apiRes = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: cleanEmail, password, role: "farmer" })
          });
          if (apiRes.ok) {
            resData = await apiRes.json();
          } else {
            const errData = await apiRes.json();
            throw new Error(errData.message || "Invalid credentials");
          }
        } catch (err: any) {
          resData = await storeLoginUser({ email: cleanEmail, password, role: "farmer" });
        }

        toast.success("Farmer Authentication Verified!", {
          description: `Welcome back, ${resData.user.name}!`,
        });
      }

      // Remember email if checked
      if (rememberEmail) {
        localStorage.setItem("remembered_email", cleanEmail);
      }

      // Store session securely (NEVER store plaintext password)
      const sessionObj = {
        token: resData.token,
        user: resData.user,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem("agrisphere_user", JSON.stringify(sessionObj));

      setTimeout(() => {
        navigate({ to: "/farmer" });
      }, 900);
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed. Please check your credentials.");
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
          {isRegister ? "Farmer Registration" : "Farmer Login"}
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isRegister
            ? "Create your AgriSphere farmer account to manage crops and market listings."
            : "Sign in with your email & password to access your farm portal."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="bg-white py-8 px-6 border border-border shadow-md rounded-3xl sm:px-10 flex flex-col gap-6">
          
          {/* Identity Box */}
          <div className="rounded-2xl bg-tile-green-icon/5 border border-primary/10 p-4 flex gap-3 text-xs text-primary leading-normal">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-bold">Secure Encrypted Authentication</p>
              <p className="text-muted-foreground mt-0.5">
                Default Demo Login: <strong className="text-primary font-semibold">farmer@agrisphere.com</strong> / <strong className="text-primary font-semibold">Farmer@123</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" method="POST" action="#">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5" htmlFor="farmer-name">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="farmer-name"
                    type="text"
                    required
                    name="name"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g. Rajesh Patil"
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
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5" htmlFor="farmer-email">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="farmer-email"
                  type="email"
                  required
                  name="email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="farmer@agrisphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5" htmlFor="farmer-password">
                Password *
              </label>
              <div className="relative">
                <input
                  id="farmer-password"
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
                {isRegister ? "Already registered? Sign In" : "Need an account? Register"}
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
                  {isRegister ? "Creating Account..." : "Authenticating..."}
                </>
              ) : (
                <>
                  <KeyRound className="size-4" />
                  {isRegister ? "Create Farmer Account" : "Sign In to Farmer Portal"}
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
