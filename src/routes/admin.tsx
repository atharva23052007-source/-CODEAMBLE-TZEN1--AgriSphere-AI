import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Handshake,
  FileCheck,
  Activity,
  LogOut,
  TrendingUp,
  IndianRupee,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronRight,
  ShieldAlert,
  Sprout,
  Building2,
  Landmark,
  Eye,
  RefreshCw,
  ArrowUpRight,
  Boxes,
  Truck,
  BadgeCheck,
  AlertCircle,
  BarChart2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import logoImg from "@/assets/logo.png";
import {
  loginSuperAdmin,
  getAdminOverview,
  getAdminFarmers,
  getAdminLandExtracts,
  getAdminAppraisals,
  getAdminActivity,
  approveAdminAppraisal,
  rejectAdminAppraisal,
  auditAdminLandExtract,
} from "../lib/adminServerFns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/admin")({
  component: SuperAdminDashboard,
});

type AdminTab = "overview" | "traders" | "farmers" | "land" | "approvals" | "activity";

// ─── Helpers ─────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Booked: "bg-amber-50 text-amber-700 border-amber-200",
    Delivered: "bg-sky-50 text-sky-700 border-sky-200",
    "Escrow Locked": "bg-purple-50 text-purple-700 border-purple-200",
    "Seller Accepts": "bg-blue-50 text-blue-700 border-blue-200",
    Dispatched: "bg-orange-50 text-orange-700 border-orange-200",
    "In Transit": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "Delivered & Settled": "bg-green-50 text-green-700 border-green-200",
    Verified: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    SETTLED: "bg-green-50 text-green-700 border-green-200",
    LOCKED: "bg-purple-50 text-purple-700 border-purple-200",
    RELEASED: "bg-sky-50 text-sky-700 border-sky-200",
    Success: "bg-green-50 text-green-700 border-green-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
    Linked: "bg-green-50 text-green-700 border-green-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Unapplied: "bg-gray-50 text-gray-600 border-gray-200",
  };
  const cls = map[status] ?? "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-border shadow-sm p-5 overflow-hidden group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-extrabold text-foreground mt-1 leading-none">{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div
          className="size-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: accent + "22" }}
        >
          <Icon className="size-5" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Session State
  const [session, setSession] = useState<{ token: string; user: { name: string; email: string; role: string } } | null>(() => {
    if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
      const saved = sessionStorage.getItem("agrisphere_admin_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.user?.role === "super_admin") return parsed;
        } catch (_) { /* invalid session */ }
      }
    }
    return null;
  });

  // Login Gate form state
  const [gateEmail, setGateEmail] = useState("atharva23052007@gmail.com");
  const [gatePassword, setGatePassword] = useState("");
  const [gateLoading, setGateLoading] = useState(false);

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateLoading(true);
    try {
      const res = await loginSuperAdmin({ data: { email: gateEmail, pass: gatePassword } });
      const newSession = {
        token: res.token,
        user: res.user,
      };
      sessionStorage.setItem("agrisphere_admin_session", JSON.stringify(newSession));
      setSession(newSession as any);
      toast.success("Authenticated as Super Admin!", { description: `Welcome ${res.user.name}` });
    } catch (err: any) {
      toast.error(err?.message || "Invalid Super Admin credentials.");
    } finally {
      setGateLoading(false);
    }
  };

  // ── Data Queries with 5s Live Auto-Polling ─────────────────────
  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: () => getAdminOverview(),
    refetchInterval: 5_000,
    staleTime: 2_000,
  });

  const { data: farmers = [], isLoading: loadingFarmers } = useQuery({
    queryKey: ["adminFarmers"],
    queryFn: () => getAdminFarmers(),
    refetchInterval: 5_000,
    staleTime: 2_000,
  });

  const { data: landExtracts = [], isLoading: loadingLand } = useQuery({
    queryKey: ["adminLandExtracts"],
    queryFn: () => getAdminLandExtracts(),
    refetchInterval: 5_000,
    staleTime: 2_000,
  });

  const { data: appData, isLoading: loadingAppraisals } = useQuery({
    queryKey: ["adminAppraisals"],
    queryFn: () => getAdminAppraisals(),
    refetchInterval: 5_000,
    staleTime: 2_000,
  });

  const { data: activity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ["adminActivity"],
    queryFn: () => getAdminActivity(),
    refetchInterval: 5_000,
    staleTime: 2_000,
  });

  // Local appraisal state (for non-mongo fallback mutations)
  const [localAppraisals, setLocalAppraisals] = useState<typeof appData extends { appraisals: infer A } ? A : any[]>([]);
  useEffect(() => {
    if (appData?.appraisals) setLocalAppraisals(appData.appraisals);
  }, [appData]);

  const handleApprove = async (id: string, name: string) => {
    try {
      await approveAdminAppraisal({ data: { id } });
      setLocalAppraisals((prev: any[]) =>
        prev.map((a: any) => (a.id === id ? { ...a, status: "Approved" } : a))
      );
      queryClient.invalidateQueries({ queryKey: ["adminAppraisals"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
      toast.success(`Approved: ${name}`, { description: "DBT disbursement initiated." });
    } catch {
      toast.error("Failed to approve. Try again.");
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await rejectAdminAppraisal({ data: { id } });
      setLocalAppraisals((prev: any[]) =>
        prev.map((a: any) => (a.id === id ? { ...a, status: "Rejected" } : a))
      );
      queryClient.invalidateQueries({ queryKey: ["adminAppraisals"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
      toast.error(`Rejected: ${name}`, { description: "Returned to operator queue." });
    } catch {
      toast.error("Failed to reject. Try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("agrisphere_admin_session");
    setSession(null);
    toast.info("Logged out from Super Admin session.");
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
    queryClient.invalidateQueries({ queryKey: ["adminFarmers"] });
    queryClient.invalidateQueries({ queryKey: ["adminLandExtracts"] });
    queryClient.invalidateQueries({ queryKey: ["adminAppraisals"] });
    queryClient.invalidateQueries({ queryKey: ["adminActivity"] });
    toast.success("Data refreshed");
  };

  // ── Unauthenticated Auth Gate ─────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <Toaster position="top-right" />
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border shadow-sm text-sm text-primary hover:bg-secondary transition"
          >
            <ArrowUpRight className="size-4 rotate-180" /> Back to Platform
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in flex flex-col items-center">
          <div className="size-16 rounded-2xl bg-white border border-border flex items-center justify-center shadow-md p-1">
            <img src={logoImg} alt="AgriSphere logo" className="size-full object-contain" />
          </div>
          <div className="flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldAlert className="size-3.5" />
            super_admin Role Permission Required
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground tracking-tight">
            Super Admin Dashboard
          </h2>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Please log in with verified platform owner credentials to continue
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
          <div className="bg-white py-8 px-6 border border-border shadow-xl rounded-3xl sm:px-10 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: "oklch(0.55 0.18 280)" }} />

            <form onSubmit={handleGateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  Admin Account Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "oklch(0.55 0.18 280 / 0.4)" } as any}
                  placeholder="atharva23052007@gmail.com"
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 border border-border rounded-xl h-11 text-sm bg-white font-medium focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "oklch(0.55 0.18 280 / 0.4)" } as any}
                  placeholder="••••••••"
                  value={gatePassword}
                  onChange={(e) => setGatePassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={gateLoading}
                className="w-full h-11 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
                style={{ background: "oklch(0.55 0.18 280)" }}
              >
                {gateLoading ? "Verifying super_admin role in MongoDB…" : "Log In to Dashboard"}
              </button>
            </form>

            <div className="border-t border-border pt-3 text-center">
              <span className="text-[11px] text-muted-foreground">
                Owner Account: <b>atharva23052007@gmail.com</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Chart data ───────────────────────────────────────────────
  const contractChartData = (overview?.contracts ?? []).slice(0, 8).map((c: any, i: number) => ({
    name: c.id,
    amount: c.amount,
    idx: i,
  }));

  const listingStatusData = [
    { name: "Available", value: overview?.availableListings ?? 0, color: "#10b981" },
    { name: "Booked", value: overview?.bookedListings ?? 0, color: "#f59e0b" },
    { name: "Delivered", value: overview?.deliveredListings ?? 0, color: "#3b82f6" },
  ];

  // ── Sidebar nav ──────────────────────────────────────────────
  const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "traders", label: "Traders & Sellers", icon: Handshake },
    { id: "farmers", label: "Farmer Registry", icon: Sprout },
    { id: "land", label: "7/12 Land Extracts", icon: FileCheck },
    { id: "approvals", label: "Approvals & DBT", icon: FileCheck },
    { id: "activity", label: "Activity Log", icon: Activity },
  ];

  const roleLinks = [
    { label: "Farmer Portal", to: "/farmer", icon: Sprout, color: "#10b981" },
    { label: "Buyer/Trader", to: "/buyer", icon: Handshake, color: "#f59e0b" },
    { label: "NGO/Operator", to: "/operator", icon: Building2, color: "#3b82f6" },
    { label: "Govt Officer", to: "/officer", icon: Landmark, color: "#8b5cf6" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex text-sm">
      <Toaster position="top-right" />

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col bg-sidebar border-r border-border p-6 justify-between sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm overflow-hidden p-1">
              <img src={logoImg} alt="AgriSphere AI" className="size-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                <span className="text-primary">AgriSphere</span>{" "}
                <span
                  className="font-extrabold"
                  style={{ color: "oklch(0.5 0.18 280)" }}
                >
                  ADMIN
                </span>
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold leading-tight">
                  Super Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Admin badge */}
          <div
            className="rounded-xl p-3 border"
            style={{
              background: "oklch(0.97 0.03 280)",
              borderColor: "oklch(0.85 0.08 280)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="size-8 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.5 0.18 280)" }}
              >
                <ShieldAlert className="size-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "oklch(0.4 0.18 280)" }}>
                  Super Administrator
                </p>
                <p className="text-[10px] text-muted-foreground">Full platform access</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 px-1">
              Dashboard
            </p>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`admin-nav-${id}`}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left w-full ${
                  activeTab === id
                    ? "text-white shadow-sm"
                    : "text-foreground hover:bg-accent"
                }`}
                style={
                  activeTab === id
                    ? { background: "oklch(0.5 0.18 280)" }
                    : {}
                }
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {activeTab === id && <ChevronRight className="ml-auto size-3" />}
              </button>
            ))}
          </nav>

          {/* Role Quick Links */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2 px-1">
              Jump to Role
            </p>
            <div className="flex flex-col gap-1">
              {roleLinks.map(({ label, to, icon: Icon, color }) => (
                <Link
                  key={to}
                  to={to as any}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-accent transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <div
                    className="size-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: color + "22" }}
                  >
                    <Icon className="size-3" style={{ color }} />
                  </div>
                  {label}
                  <ArrowUpRight className="ml-auto size-3 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-destructive/10 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-[1280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live data from all AgriSphere platform roles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="admin-refresh-btn"
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold hover:bg-accent transition-colors"
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* ── OVERVIEW TAB ───────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            {loadingOverview ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                <RefreshCw className="size-5 animate-spin mr-2" />
                Loading platform data…
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Listings"
                    value={String(overview?.totalListings ?? 0)}
                    sub={`${overview?.availableListings ?? 0} available`}
                    icon={Package}
                    accent="oklch(0.5 0.14 150)"
                  />
                  <StatCard
                    label="Active Contracts"
                    value={String(overview?.activeContracts ?? 0)}
                    sub={`${overview?.totalContracts ?? 0} total`}
                    icon={Handshake}
                    accent="oklch(0.55 0.18 280)"
                  />
                  <StatCard
                    label="Registered Farmers"
                    value={String(overview?.totalFarmers ?? 0)}
                    sub="across all districts"
                    icon={Sprout}
                    accent="oklch(0.68 0.16 150)"
                  />
                  <StatCard
                    label="Pending Approvals"
                    value={String(overview?.pendingApprovals ?? 0)}
                    sub="DBT appraisals"
                    icon={Clock}
                    accent="oklch(0.75 0.15 60)"
                  />
                  <StatCard
                    label="Escrow Locked"
                    value={fmt(overview?.escrowLocked ?? 0)}
                    sub="in active contracts"
                    icon={ShieldCheck}
                    accent="oklch(0.6 0.18 240)"
                  />
                  <StatCard
                    label="Platform Volume"
                    value={fmt(overview?.totalVolume ?? 0)}
                    sub="settled transactions"
                    icon={IndianRupee}
                    accent="oklch(0.65 0.16 30)"
                  />
                  <StatCard
                    label="Total Balances"
                    value={fmt(overview?.totalBalances ?? 0)}
                    sub="across all wallets"
                    icon={TrendingUp}
                    accent="oklch(0.58 0.16 180)"
                  />
                  <StatCard
                    label="Delivered Orders"
                    value={String(overview?.deliveredListings ?? 0)}
                    sub="completed deliveries"
                    icon={Truck}
                    accent="oklch(0.6 0.14 220)"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contract Amounts Chart */}
                  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <BarChart2 className="size-4" style={{ color: "oklch(0.55 0.18 280)" }} />
                      Contract Values
                    </h3>
                    {contractChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={contractChartData}>
                          <defs>
                            <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="oklch(0.55 0.18 280)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="oklch(0.55 0.18 280)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                          <YAxis tick={{ fontSize: 9 }} />
                          <Tooltip
                            formatter={(v: number) => [fmt(v), "Amount"]}
                            contentStyle={{ fontSize: 11, borderRadius: 8 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="oklch(0.55 0.18 280)"
                            fill="url(#adminGrad)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-xs">
                        No contract data yet
                      </div>
                    )}
                  </div>

                  {/* Listing Status Breakdown */}
                  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Boxes className="size-4" style={{ color: "oklch(0.5 0.14 150)" }} />
                      Listing Status Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={listingStatusData} barSize={36}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Bar
                          dataKey="value"
                          radius={[6, 6, 0, 0]}
                          fill="oklch(0.5 0.14 150)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Contracts Table */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <Handshake className="size-4" style={{ color: "oklch(0.55 0.18 280)" }} />
                    <h3 className="text-sm font-bold">Recent Contracts</h3>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {overview?.contracts?.length ?? 0} total
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          {["ID", "Crop", "Qty", "Amount", "Origin → Dest", "Status", "Date"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(overview?.contracts ?? []).slice(0, 6).map((c: any) => (
                          <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono font-semibold text-[11px]">{c.id}</td>
                            <td className="px-4 py-3 font-semibold">{c.crop}</td>
                            <td className="px-4 py-3 text-muted-foreground">{c.qty}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{fmt(c.amount)}</td>
                            <td className="px-4 py-3 text-muted-foreground text-[10px]">
                              {c.origin} → {c.dest}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={c.status} />
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{c.date}</td>
                          </tr>
                        ))}
                        {(overview?.contracts ?? []).length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                              No contracts yet — Buyer/Trader activity will appear here
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TRADERS TAB ────────────────────────────────────── */}
        {activeTab === "traders" && (
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="admin-trader-search"
                type="text"
                placeholder="Search crop, FPO, contract…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-xs w-full focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "oklch(0.55 0.18 280 / 0.4)" } as any}
              />
            </div>

            {/* Listings */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Package className="size-4 text-primary" />
                <h3 className="text-sm font-bold">All Listings</h3>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {overview?.listings?.length ?? 0} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {["ID", "Crop", "FPO / Seller", "Qty", "Price", "Location", "Status"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(overview?.listings ?? [])
                      .filter(
                        (l: any) =>
                          !searchTerm ||
                          l.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.fpo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.id.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((l: any) => (
                        <tr key={l.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-[11px]">{l.id}</td>
                          <td className="px-4 py-3 font-semibold">{l.crop}</td>
                          <td className="px-4 py-3 text-muted-foreground">{l.fpo}</td>
                          <td className="px-4 py-3">{l.qty}</td>
                          <td className="px-4 py-3 font-semibold text-primary">{l.price}</td>
                          <td className="px-4 py-3 text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3 shrink-0" />{l.location}
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contracts */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Handshake className="size-4" style={{ color: "oklch(0.55 0.18 280)" }} />
                <h3 className="text-sm font-bold">All Contracts</h3>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {overview?.contracts?.length ?? 0} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {["Contract ID", "Crop", "Qty", "Amount (₹)", "Buyer → Seller", "Origin", "Status", "Date"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(overview?.contracts ?? []).map((c: any) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-[11px]">{c.id}</td>
                        <td className="px-4 py-3 font-semibold">{c.crop}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.qty}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{fmt(c.amount)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-[10px]">{c.buyerId} → {c.sellerId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.origin}</td>
                        <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                        <td className="px-4 py-3 text-muted-foreground">{c.date}</td>
                      </tr>
                    ))}
                    {(overview?.contracts ?? []).length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                          No contracts yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ledger */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <IndianRupee className="size-4 text-primary" />
                <h3 className="text-sm font-bold">Recent Ledger Entries</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {["Tx Hash", "Type", "Crop", "FPO", "Amount (₹)", "Date", "Status", "User"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(overview?.ledgers ?? []).map((l: any) => (
                      <tr key={l.txHash} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-[10px] font-semibold">{l.txHash}</td>
                        <td className="px-4 py-3 font-semibold">{l.type}</td>
                        <td className="px-4 py-3 text-muted-foreground">{l.crop}</td>
                        <td className="px-4 py-3 text-muted-foreground">{l.fpo}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{fmt(l.amount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{l.date}</td>
                        <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                        <td className="px-4 py-3 font-mono text-[10px]">{l.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── FARMERS TAB ────────────────────────────────────── */}
        {activeTab === "farmers" && (
          <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="admin-farmer-search"
                type="text"
                placeholder="Search name, village, crop…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-xs w-full focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "oklch(0.5 0.14 150 / 0.4)" } as any}
              />
            </div>

            {loadingFarmers ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                <RefreshCw className="size-5 animate-spin mr-2" />
                Loading farmer registry…
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <Sprout className="size-4 text-primary" />
                  <h3 className="text-sm font-bold">Farmer Registry</h3>
                  <span className="ml-auto text-[10px] text-muted-foreground">{farmers.length} farmers</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {["ID", "Name", "Village", "Crop", "Land (ac)", "Aadhaar KYC", "DBT Status", "Bank", "Schemes", "Status"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {farmers
                        .filter(
                          (f) =>
                            !searchTerm ||
                            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.crop.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((f) => (
                          <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono font-semibold text-[11px]">{f.id}</td>
                            <td className="px-4 py-3 font-semibold">{f.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="size-3 shrink-0" />{f.village}
                              </div>
                            </td>
                            <td className="px-4 py-3">{f.crop}</td>
                            <td className="px-4 py-3">{f.land}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-semibold ${f.aadhaarSeeded.includes("✓") ? "text-green-600" : "text-amber-600"}`}>
                                {f.aadhaarSeeded}
                              </span>
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={f.dbtStatus} /></td>
                            <td className="px-4 py-3 font-mono text-[10px]">{f.bank}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {f.schemes.length > 0
                                  ? f.schemes.map((s) => (
                                      <span key={s} className="px-1.5 py-0.5 rounded bg-accent text-[10px] font-medium text-primary">{s}</span>
                                    ))
                                  : <span className="text-muted-foreground">—</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LAND EXTRACTS TAB ──────────────────────────────── */}
        {activeTab === "land" && (
          <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="admin-land-search"
                type="text"
                placeholder="Search survey no, farmer name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-xs w-full focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "oklch(0.5 0.14 150 / 0.4)" } as any}
              />
            </div>

            {loadingLand ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                <RefreshCw className="size-5 animate-spin mr-2" />
                Loading land extracts from MongoDB…
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <FileCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-bold">7/12 Land Extract Audits</h3>
                  <span className="ml-auto text-[10px] text-muted-foreground">{landExtracts.length} extracts</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {["Extract ID", "Farmer Name", "Survey No", "Acreage", "Soil Composition", "Digital File", "Inspection Status"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {landExtracts
                        .filter(
                          (l: any) =>
                            !searchTerm ||
                            l.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.surveyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.id.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((l: any) => (
                          <tr key={l.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono font-semibold text-[11px]">{l.id}</td>
                            <td className="px-4 py-3 font-semibold">{l.farmerName}</td>
                            <td className="px-4 py-3 font-mono">{l.surveyNo}</td>
                            <td className="px-4 py-3">{l.acreage} Acres</td>
                            <td className="px-4 py-3 text-muted-foreground text-[11px]">{l.soil}</td>
                            <td className="px-4 py-3 font-mono text-[10px] text-primary font-bold">{l.file}</td>
                            <td className="px-4 py-3">
                              {l.inspected ? (
                                <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full text-[10px] border border-green-200">
                                  <CheckCircle className="size-3" /> Inspected & Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                                  <Clock className="size-3" /> Awaiting Inspection
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── APPROVALS TAB ──────────────────────────────────── */}
        {activeTab === "approvals" && (
          <div className="flex flex-col gap-6">
            {loadingAppraisals ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                <RefreshCw className="size-5 animate-spin mr-2" />
                Loading approval data…
              </div>
            ) : (
              <>
                {/* DBT Appraisals */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <FileCheck className="size-4 text-primary" />
                    <h3 className="text-sm font-bold">DBT Appraisal Queue</h3>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {localAppraisals.filter((a: any) => a.status === "Pending").length} Pending
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          {["ID", "Scheme Name", "Farmers", "Amount", "Submitted By", "Status", "Actions"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {localAppraisals.map((a: any) => (
                          <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono font-semibold text-[11px]">{a.id}</td>
                            <td className="px-4 py-3 font-semibold">{a.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{a.farmers}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{a.amount}</td>
                            <td className="px-4 py-3 text-muted-foreground">{a.submittedBy}</td>
                            <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                            <td className="px-4 py-3">
                              {a.status === "Pending" && (
                                <div className="flex items-center gap-2">
                                  <button
                                    id={`approve-${a.id}`}
                                    onClick={() => handleApprove(a.id, a.name)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors"
                                  >
                                    <CheckCircle className="size-3" />
                                    Approve
                                  </button>
                                  <button
                                    id={`reject-${a.id}`}
                                    onClick={() => handleReject(a.id, a.name)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-colors"
                                  >
                                    <XCircle className="size-3" />
                                    Reject
                                  </button>
                                </div>
                              )}
                              {a.status === "Approved" && (
                                <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
                                  <BadgeCheck className="size-3" />
                                  Disbursed
                                </span>
                              )}
                              {a.status === "Rejected" && (
                                <span className="flex items-center gap-1 text-red-500 text-[10px] font-semibold">
                                  <AlertCircle className="size-3" />
                                  Returned
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fertilizer Logs */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <Sprout className="size-4 text-primary" />
                    <h3 className="text-sm font-bold">Fertilizer Distribution Logs</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          {["Log ID", "Date", "District", "Farmer ID", "Type", "Quantity", "Subsidy"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(appData?.fertilizer ?? []).map((f: any) => (
                          <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono text-[11px] font-semibold">{f.id}</td>
                            <td className="px-4 py-3 text-muted-foreground">{f.date}</td>
                            <td className="px-4 py-3">{f.district}</td>
                            <td className="px-4 py-3 font-mono text-[10px]">{f.farmerId}</td>
                            <td className="px-4 py-3 font-semibold">{f.type}</td>
                            <td className="px-4 py-3 text-muted-foreground">{f.quantity}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{f.subsidy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Aadhaar Audit */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <ShieldCheck className="size-4" style={{ color: "oklch(0.55 0.18 280)" }} />
                    <h3 className="text-sm font-bold">Aadhaar Audit Log</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          {["Audit ID", "Timestamp", "Action", "Aadhaar (Last 4)", "Operator", "Status"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[11px] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(appData?.aadhaar ?? []).map((a: any) => (
                          <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-mono text-[11px] font-semibold">{a.id}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{a.timestamp}</td>
                            <td className="px-4 py-3 font-semibold">{a.action}</td>
                            <td className="px-4 py-3 font-mono">****{a.aadhaarLast4}</td>
                            <td className="px-4 py-3 text-muted-foreground">{a.operator}</td>
                            <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ACTIVITY TAB ────────────────────────────────────── */}
        {activeTab === "activity" && (
          <div className="flex flex-col gap-4">
            {loadingActivity ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                <RefreshCw className="size-5 animate-spin mr-2" />
                Loading activity feed…
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <Activity className="size-4" style={{ color: "oklch(0.55 0.18 280)" }} />
                  <h3 className="text-sm font-bold">Unified Activity Feed</h3>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {activity.length} events
                  </span>
                </div>
                <div className="divide-y divide-border/50">
                  {activity.length === 0 && (
                    <div className="px-6 py-10 text-center text-muted-foreground text-xs">
                      No activity recorded yet
                    </div>
                  )}
                  {activity.map((ev) => {
                    const colorMap = {
                      contract: { bg: "oklch(0.55 0.18 280 / 0.12)", icon: "oklch(0.55 0.18 280)", Icon: Handshake },
                      ledger: { bg: "oklch(0.5 0.14 150 / 0.12)", icon: "oklch(0.5 0.14 150)", Icon: IndianRupee },
                      listing: { bg: "oklch(0.75 0.15 60 / 0.12)", icon: "oklch(0.75 0.15 60)", Icon: Package },
                    };
                    const { bg, icon: iconColor, Icon: EvIcon } = colorMap[ev.type];
                    return (
                      <div key={ev.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                        <div
                          className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: bg }}
                        >
                          <EvIcon className="size-4" style={{ color: iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs">{ev.label}</span>
                            <StatusBadge status={ev.status} />
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{ev.detail}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {ev.amount !== undefined && (
                            <p className="text-xs font-bold text-primary">{fmt(ev.amount)}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-0.5">{ev.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
