import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, ShieldCheck, Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/login/operator")({
  component: OperatorLogin,
});

function OperatorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Authentication Successful!", {
        description: "Welcome FPO Admin Operator workspace.",
      });
      setTimeout(() => {
        navigate({ to: "/operator" });
      }, 1000);
    }, 1500);
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
          Operator Portal
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          NGO / FPO / Agency Administrator Access.
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
                Connecting to primary AgriSphere DBT registry. All operations are logged.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Operator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="name@fpo-agency.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/95 transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying operator permissions...
                </>
              ) : (
                "Log In to Workspace"
              )}
            </button>
          </form>

          {/* Setup / Help note */}
          <div className="border-t border-border pt-4 text-center">
            <span className="text-[10px] text-muted-foreground">
              Issues logging in? Reach DBT operations helpline for secure credentials reset.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
