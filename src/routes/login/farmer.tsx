import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Phone, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/login/farmer")({
  component: FarmerLogin,
});

function FarmerLogin() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimer(30);
      toast.success("✅ Secure OTP sent via SMS!", {
        description: `OTP has been dispatched to +91 ******${mobile.slice(-4)}`,
      });
      // Pre-fill a mock pattern for easier evaluation
      setOtp("7498");
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("OTP must be exactly 4 digits.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("OTP Verified Successfully!", {
        description: "Welcome to AgriSphere AI, Rajesh Patil!",
      });
      setTimeout(() => {
        navigate({ to: "/farmer" });
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
          Farmer Login
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter your registered mobile number linked with Aadhaar / DBT ledger.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="bg-white py-8 px-6 border border-border shadow-md rounded-3xl sm:px-10 flex flex-col gap-6">
          
          {/* Identity Box */}
          <div className="rounded-2xl bg-tile-green-icon/5 border border-primary/10 p-4 flex gap-3 text-xs text-primary leading-normal">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-bold">Secured OTP Authentication</p>
              <p className="text-muted-foreground mt-0.5">
                Passwords are never stored to protect account security. Direct DBT links use cryptographic credentials.
              </p>
            </div>
          </div>

          {!otpSent ? (
            /* SEND OTP FORM */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-muted-foreground font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="w-full pl-12 pr-4 border border-border rounded-xl h-11 text-sm bg-white font-semibold tracking-wide focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Enter 10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Phone className="size-4 text-muted-foreground/60" />
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
                    Sending OTP code...
                  </>
                ) : (
                  "Send Verification OTP"
                )}
              </button>
            </form>
          ) : (
            /* VERIFY OTP FORM */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-muted-foreground block">
                    Enter 4-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Edit Phone Number
                  </button>
                </div>
                
                <input
                  type="text"
                  required
                  maxLength={4}
                  className="w-full text-center tracking-widest border border-border rounded-xl h-11 text-lg bg-white font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                
                <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
                  Didn't receive code?{" "}
                  {timer > 0 ? (
                    <span className="font-semibold text-foreground">Resend in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="font-bold text-primary hover:underline"
                    >
                      Resend Code Now
                    </button>
                  )}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/95 transition text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Verifying OTP credentials...
                  </>
                ) : (
                  "Verify & Secure Log In"
                )}
              </button>
            </form>
          )}

          {/* Setup / Help note */}
          <div className="border-t border-border pt-4 text-center">
            <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
              <HelpCircle className="size-3 text-muted-foreground/80" />
              Not registered? Contact nearest FPO Operator for DBT seeding database.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
