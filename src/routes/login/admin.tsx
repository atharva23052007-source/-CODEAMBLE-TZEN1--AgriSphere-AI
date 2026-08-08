import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, ShieldAlert, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";
import { loginSuperAdmin } from "../../lib/adminServerFns";

export const Route = createFileRoute("/login/admin")({
  component: SuperAdminLogin,
});

function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("atharva23052007@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remembered_email");
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your Super Admin password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginSuperAdmin({ data: { email: cleanEmail, pass: password } });
      toast.success("Super Admin Authentication Successful!", {
        description: `Welcome, ${res.user.name}. Role: super_admin verified.`,
      });

      if (rememberEmail) {
        localStorage.setItem("remembered_email", cleanEmail);
      }

      sessionStorage.setItem(
        "agrisphere_admin_session",
        JSON.stringify({
          token: res.token,
          user: res.user,
          loginTime: new Date().toISOString(),
        })
      );
      setTimeout(() => {
        navigate({ to: "/admin" });
      }, 900);
    } catch (err: any) {
      toast.error(err?.message || "Invalid Super Admin credentials or insufficient permissions.", {
        description: "Check email & password and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Toaster position="top-right" />

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border shadow-sm text-sm text-primary hover:bg-secondary leading-none transition duration-200"
        >
          <ArrowLeft className="size-4" />
          Back to Platform
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in flex flex-col items-center">
        <div
          className="size-16 rounded-2xl bg-white border border-border flex items-center justify-center shadow-md p-1"
          style={{ borderColor: "oklch(0.85 0.08 280)" }}
        >
          <img src={logoImg} alt="AgriSphere AI" className="size-full object-contain" />
        </div>
        <div className="flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldAlert className="size-3.5" />
          Restricted Owner Portal
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground tracking-tight">
          Super Admin Access
        </h2>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Platform Owner Authentication & Role Verification
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="bg-white py-8 px-6 border border-border shadow-xl rounded-3xl sm:px-10 flex flex-col gap-6 relative overflow-hidden">
          <div
            className="absolute top-0 inset-x-0 h-1.5"
            style={{ background: "oklch(0.55 0.18 280)" }}
          />

          {/* Security Notice */}
          <div
            className="rounded-2xl p-4 flex gap-3 text-xs leading-relaxed"
            style={{
              background: "oklch(0.97 0.03 280)",
              borderColor: "oklch(0.88 0.07 280)",
              borderWidth: 1,
            }}
          >
            <KeyRound className="size-5 shrink-0" style={{ color: "oklch(0.55 0.18 280)" }} />
            <div>
              <p className="font-bold" style={{ color: "oklch(0.4 0.18 280)" }}>
                Role Permission Guard Active
              </p>
              <p className="text-muted-foreground mt-0.5">
                Default Owner: <strong className="text-foreground">atharva23052007@gmail.com</strong> / <strong className="text-foreground">Atharva@2007</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" method="POST" action="#">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2" htmlFor="admin-email-input">
                Super Admin Email
              </label>
              <div className="relative">
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  name="email"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "oklch(0.55 0.18 280 / 0.4)" } as any}
                  placeholder="atharva23052007@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2" htmlFor="admin-password-input">
                Super Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  name="password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "oklch(0.55 0.18 280 / 0.4)" } as any}
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
                  className="rounded border-border text-purple-600 focus:ring-purple-500"
                />
                Remember my email
              </label>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-11 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              style={{ background: "oklch(0.55 0.18 280)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying super_admin role in MongoDB…
                </>
              ) : (
                "Authenticate as Super Admin"
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="border-t border-border pt-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 text-[11px] text-muted-foreground">
              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
              <span>Owner Email: <b>atharva23052007@gmail.com</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
