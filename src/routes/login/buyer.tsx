import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, UserCheck, Lock, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/login/buyer")({
  component: BuyerLogin,
});

function BuyerLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim().length < 4) {
      toast.error("Please enter a valid email or phone number.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Merchant Login Verified!", {
        description: "Welcome to AgriSphere Wholesale Market Portal.",
      });
      setTimeout(() => {
        navigate({ to: "/buyer" });
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
          Merchant / Trader
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Access local wholesale catalogs and secure pre-harvest contracts.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="bg-white py-8 px-6 border border-border shadow-md rounded-3xl sm:px-10 flex flex-col gap-6">
          
          {/* Identity Box */}
          <div className="rounded-2xl bg-tile-amber-icon/5 border border-tile-amber-icon/10 p-4 flex gap-3 text-xs text-tile-amber-icon leading-normal">
            <ShieldCheck className="size-5 shrink-0" />
            <div>
              <p className="font-bold">Verified Buyer Network</p>
              <p className="text-muted-foreground mt-0.5">
                Check and audit farmer bank details and digital certificates before finalizing escrows.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Merchant Email or Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. procurement@agri-bulk.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
              className="w-full h-11 bg-tile-amber-icon text-white hover:bg-tile-amber-icon/90 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying merchant authentication...
                </>
              ) : (
                "Log In to Wholesale Portal"
              )}
            </button>
          </form>

          {/* Setup / Help note */}
          <div className="border-t border-border pt-4 text-center">
            <span className="text-[10px] text-muted-foreground">
              To apply for a procurement trading license, contact AgriSphere Merchant Cell.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
