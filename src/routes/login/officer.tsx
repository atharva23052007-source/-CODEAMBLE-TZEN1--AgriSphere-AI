import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, UserCheck, Lock, ShieldCheck, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/login/officer")({
  component: OfficerLogin,
});

function OfficerLogin() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (officerId.trim().length < 4) {
      toast.error("Please enter a valid Officer ID.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Officer Authentication Approved!", {
        description: "Welcome Government Field Officer workspace.",
      });
      setTimeout(() => {
        navigate({ to: "/officer" });
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
          Government Officer
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          DBT Verification & Sub-grant Appraisals Workspace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        {/* Toggle Headings */}
        <div className="flex bg-white/60 p-1 border border-border rounded-t-3xl border-b-0 max-w-sm mx-auto">
          <Link
            to="/login/operator"
            className="flex-1 py-2 text-xs font-semibold text-center text-muted-foreground hover:text-foreground transition flex items-center justify-center gap-1.5"
          >
            🏢 Operator
          </Link>
          <span className="flex-1 py-2 text-xs font-bold text-center bg-white text-[oklch(0.35_0.15_255)] border border-border rounded-t-2xl shadow-sm">
            🏛️ Officer Login
          </span>
        </div>

        <div className="bg-white py-8 px-6 border border-border shadow-md rounded-b-3xl rounded-tl-3xl sm:px-10 flex flex-col gap-6">
          
          {/* Identity Box */}
          <div className="rounded-2xl bg-[oklch(0.35_0.15_255)]/5 border border-[oklch(0.35_0.15_255)]/10 p-4 flex gap-3 text-xs text-[oklch(0.35_0.15_255)] leading-normal">
            <ShieldCheck className="size-5 shrink-0" />
            <div>
              <p className="font-bold">Government DBT Verification Protocol</p>
              <p className="text-muted-foreground mt-0.5">
                Authorized personnel strictly. Accessing classified subsidy disbursement logs.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Government Officer ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. GOV-MAH-26-8910"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Briefcase className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Administrative Password
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
              className="w-full h-11 bg-[oklch(0.35_0.15_255)] text-white hover:bg-[oklch(0.35_0.15_255)]/90 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Authenticating Officer credentials...
                </>
              ) : (
                "Verify Govt Identity & Enter"
              )}
            </button>
          </form>

          {/* Setup / Help note */}
          <div className="border-t border-border pt-4 text-center">
            <span className="text-[10px] text-muted-foreground">
              Report lost smart cards or credentials to the State Ministry of Agriculture DBT Cell.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
