import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileCheck,
  IndianRupee,
  LogOut,
  ChevronRight,
  TrendingDown,
  MapPin,
  Clock,
  Search,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/officer")({
  component: OfficerDashboard,
});

function OfficerDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [appraisals, setAppraisals] = useState([
    { id: "DBT-882", name: "Satara FPO Cotton Aid", farmers: 84, amount: "₹4,20,000", submittedBy: "Operator #12-D", status: "Pending" },
    { id: "DBT-883", name: "Koregaon Wheat Subsidy", farmers: 120, amount: "₹8,50,000", submittedBy: "Operator #09-A", status: "Pending" },
    { id: "DBT-884", name: "Wai Soybean Machinery", farmers: 12, amount: "₹3,15,000", submittedBy: "Operator #03-F", status: "Approved" },
    { id: "DBT-885", name: "Jawali General Crop Bima", farmers: 310, amount: "₹24,50,000", submittedBy: "Operator #11-B", status: "Approved" },
    { id: "DBT-886", name: "Mahabaleshwar Cold Storage", farmers: 4, amount: "₹5,00,050", submittedBy: "Operator #04-C", status: "Pending" },
  ]);

  const handleApprove = (id: string, name: string) => {
    setAppraisals(appraisals.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    const txId = Math.random().toString(16).substring(2, 10).toUpperCase();
    toast.success(`Approved ${name}!`, {
      description: `DBT Disbursed. Cryptographic Tx Hash: TX-${txId}`,
    });
  };

  const handleReject = (id: string, name: string) => {
    setAppraisals(appraisals.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
    toast.error(`Rejected ${name}.`, {
      description: `Returned request back to operator queue.`,
    });
  };

  const handleLogout = () => {
    toast.info("Logging out from Govt Officer workspace...");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 800);
  };

  const filteredAppraisals = appraisals.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex text-sm">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="hidden lg:flex w-[300px] shrink-0 flex-col bg-sidebar border-r border-border p-6 justify-between">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm overflow-hidden p-1">
              <img src={logoImg} alt="AgriSphere AI Emblem" className="size-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <span className="text-primary text-[oklch(0.35_0.15_255)]">AgriSphere</span>{"  "}
                <span className="text-tile-amber-icon">GOV</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase font-bold leading-tight mt-0.5">
                Government Officer Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              Administrative Control
            </span>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition bg-[oklch(0.35_0.15_255)]/10 text-[oklch(0.35_0.15_255)]">
              <Landmark className="size-4.5" />
              Sub-Grant Appraisal
            </button>
            <button 
              onClick={() => toast.info("Displaying regional fertilizer allocation records...")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition text-foreground/80 hover:bg-secondary"
            >
              <FileCheck className="size-4.5 text-muted-foreground" />
              Fertilizer Subsidy Logs
            </button>
            <button 
              onClick={() => toast.info("Opening cryptographic Aadhaar ledger...")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition text-foreground/80 hover:bg-secondary"
            >
              <ShieldCheck className="size-4.5 text-muted-foreground" />
              Aadhaar Ledger Auditing
            </button>
          </nav>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-2xl">
            <div className="size-10 rounded-xl bg-accent text-[oklch(0.35_0.15_255)] flex items-center justify-center font-bold text-sm">
              IAS
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">Shri A. Deshmukh</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Deputy DBT Director</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-650 hover:bg-red-750 text-destructive font-semibold border border-transparent rounded-xl text-xs transition"
          >
            <LogOut className="size-4" />
            Switch / Exit Role
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 flex flex-col p-4 sm:p-8 lg:p-10">
        
        {/* Header */}
        <header className="flex justify-between items-center gap-4 flex-wrap mb-8 pb-4 border-b border-border/40">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[oklch(0.35_0.15_255)] flex items-center gap-2">
              <Landmark className="size-8 text-[oklch(0.35_0.15_255)]" />
              DBT disbursement panel
            </h2>
            <p className="text-xs sm:text-xs text-muted-foreground mt-0.5 leading-snug">
              State Ministry of Agriculture & Integrated DBT Registry of Maharashtra. All disbursement actions require cryptographic approval.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleLogout}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 border border-border/60 transition"
            >
              <LogOut className="size-3.5" />
              Roles
            </button>
            <div className="flex items-center gap-1.5 bg-white border border-border px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
              <MapPin className="size-3.5 text-tile-amber-icon" />
              MH-Agr-Satara Office
            </div>
          </div>
        </header>

        {/* Primary Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Main List */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* KPI Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-border rounded-2xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">State Sub-grants Value</span>
                <div className="text-2xl font-extrabold text-[oklch(0.35_0.15_255)]">₹45.3L</div>
                <span className="text-[10px] text-green-600 block mt-1">Disbursed successfully</span>
              </div>
              <div className="p-4 bg-white border border-border rounded-2xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Pending Appraisals</span>
                <div className="text-2xl font-extrabold text-tile-amber-icon">
                  {appraisals.filter(a => a.status === "Pending").length} Files
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1">Awaiting verification</span>
              </div>
              <div className="p-4 bg-white border border-border rounded-2xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">District FPOs Managed</span>
                <div className="text-2xl font-extrabold text-foreground">18 Centers</div>
                <span className="text-[10px] text-green-600 block mt-1">Audit status: OK</span>
              </div>
            </div>

            {/* Appraisal List Container */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-sm font-bold text-[oklch(0.35_0.15_255)]">Pending Sub-grant Appraisals</h3>
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    className="w-full pl-8 pr-3 py-1.5 border border-border rounded-xl text-xs bg-white focus:outline-none"
                    placeholder="Search scheme name, Operator..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Search className="size-3.5 absolute top-2 left-2 text-muted-foreground" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2.5">ID</th>
                      <th>Appraisal Scheme</th>
                      <th>Farmers</th>
                      <th>Amount</th>
                      <th>FPO Agent</th>
                      <th>Status Check</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredAppraisals.map((a, i) => (
                      <tr key={i} className="hover:bg-secondary/25 transition">
                        <td className="py-4 font-mono font-medium text-muted-foreground">{a.id}</td>
                        <td className="font-bold text-foreground">{a.name}</td>
                        <td>{a.farmers}</td>
                        <td className="font-semibold text-primary">{a.amount}</td>
                        <td>{a.submittedBy}</td>
                        <td>
                          {a.status === "Approved" ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-semibold">
                              <CheckCircle className="size-3" /> Approved
                            </span>
                          ) : a.status === "Rejected" ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-semibold">
                              <XCircle className="size-3" /> Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-semibold">
                              <Clock className="size-3" /> Pending Eval
                            </span>
                          )}
                        </td>
                        <td className="text-right">
                          {a.status === "Pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleApprove(a.id, a.name)}
                                className="size-7 flex items-center justify-center text-white bg-primary rounded-lg hover:bg-primary/95 transition shadow-sm"
                                title="Approve & Disburse"
                              >
                                <Check className="size-4" />
                              </button>
                              <button
                                onClick={() => handleReject(a.id, a.name)}
                                className="size-7 flex items-center justify-center text-white bg-red-650 rounded-lg hover:bg-red-750 transition shadow-sm"
                                title="Reject / Return"
                              >
                                <XCircle className="size-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredAppraisals.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground font-medium">
                          No sub-grants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>

          {/* Right Column details */}
          <div className="space-y-6">
            
            {/* Audit Status Info */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[oklch(0.35_0.15_255)] flex items-center gap-1.5">
                <ShieldCheck className="size-5 text-[oklch(0.35_0.15_255)]" /> Operational Audit Status
              </h3>
              <div className="divide-y divide-border/60 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Ledger Sync</span>
                  <span className="font-semibold text-primary">Active ✓</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Public Keys</span>
                  <span className="font-mono font-medium">RSA-SHA-256</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Officer Token</span>
                  <span className="font-mono text-muted-foreground">98A7-FF01-BC2E</span>
                </div>
              </div>
            </div>

            {/* Instruction Panel */}
            <div className="p-4 border border-dashed border-border bg-white rounded-2xl">
              <h4 className="font-bold text-xs text-tile-blue-icon uppercase mb-2">Audit Instructions</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Appraisals marked as "Approved" are instantly queue-mapped to the state distribution ledger. Please confirm regional mandi pricing parity reports before authorizing claims above ₹5,00,000.
              </p>
            </div>
            
          </div>

        </div>

      </main>
    </div>
  );
}
