import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Handshake,
  ShieldCheck,
  CheckCircle,
  Truck,
  IndianRupee,
  LogOut,
  TrendingUp,
  MapPin,
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingDown,
  Navigation,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/buyer")({
  component: BuyerDashboard,
});

type TabType = "listings" | "contracts" | "escrow";

function BuyerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("listings");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Escrow balance states
  const [depositBalance, setDepositBalance] = useState(500000); // 5L INR general balance
  const [depositInput, setDepositInput] = useState("");
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  // Listings data
  const [listings, setListings] = useState([
    { id: "L-901", crop: "Soybean", fpo: "Satara Farmers Coop", qty: "45 Tons", price: "₹4,890 / Quintal", cert: "Quality Grade-A A+ Passed", status: "Available" },
    { id: "L-902", crop: "Sugarcane", fpo: "Koregaon FPO", qty: "110 Tons", price: "₹3,150 / Quintal", cert: "Organic Certified NPOP", status: "Available" },
    { id: "L-903", crop: "Premium Cotton", fpo: "Wai Agro Union", qty: "12 Tons", price: "₹7,200 / Quintal", cert: "Quality Verified SGS", status: "Booked" },
    { id: "L-904", crop: "Wheat (Sharbati)", fpo: "Satara Farmers Coop", qty: "60 Tons", price: "₹2,600 / Quintal", cert: "Grain Moisture 11% OK", status: "Available" },
  ]);

  // Contracts & Shipments
  const [contracts, setContracts] = useState([
    { id: "TX-401", crop: "Sugarcane", qty: "50 Tons", amount: 157500, status: "In Transit", eta: "2 days", origin: "Satara Hub", dest: "Mumbai Warehouse", carrier: "Sahyadri Logistics", date: "2026-07-16" },
    { id: "TX-402", crop: "Soybean", qty: "20 Tons", amount: 97800, status: "Dispatched", eta: "Today, 5 PM", origin: "Koregaon Hub", dest: "Pune Godown", carrier: "Maha Freight Co", date: "2026-07-18" },
    { id: "TX-403", crop: "Premium Cotton", qty: "12 Tons", amount: 86400, status: "Delivered & Settled", eta: "Delivered", origin: "Wai Center", dest: "Nagpur Textile Park", carrier: "Vikas Carriers", date: "2026-07-10" },
  ]);

  // Ledger history transactions
  const [ledgerEntries, setLedgerEntries] = useState([
    { txHash: "ESC-402-MH", type: "Lock Protection", crop: "Soybean", fpo: "Koregaon Hub", amount: 97800, date: "2026-07-18", status: "LOCKED" },
    { txHash: "ESC-401-MH", type: "Lock Protection", crop: "Sugarcane", fpo: "Satara Farmers Coop", amount: 157500, date: "2026-07-16", status: "LOCKED" },
    { txHash: "ESC-399-MH", type: "Disburse Release", crop: "Premium Cotton", fpo: "Wai Center", amount: 86450, date: "2026-07-10", status: "RELEASED" },
    { txHash: "DEP-102-MH", type: "Wallet Deposit", crop: "N/A", fpo: "General Deposit", amount: 200000, date: "2026-07-09", status: "SETTLED" },
  ]);

  // Derived totals
  const lockedBalance = contracts
    .filter(c => c.status === "In Transit" || c.status === "Dispatched")
    .reduce((sum, c) => sum + c.amount, 0);

  const handleBuy = (id: string, crop: string, qty: string, priceStr: string) => {
    const numericPrice = parseInt(priceStr.replace(/\D/g, ""));
    const calculatedAmount = Math.floor(numericPrice * 10 * 0.8); // mock total formulation

    if (depositBalance < calculatedAmount) {
      toast.error("Insufficient funds in general deposit vault!", {
        description: `Required: ₹${calculatedAmount.toLocaleString()}. Available: ₹${depositBalance.toLocaleString()}. Please deposit funds first.`,
      });
      setActiveTab("escrow");
      return;
    }

    // Deduct general balance
    setDepositBalance(prev => prev - calculatedAmount);

    setListings(listings.map(l => l.id === id ? { ...l, status: "Booked" } : l));
    
    // Add to contract list
    const newTxId = `TX-${Math.floor(400 + Math.random() * 599)}`;
    const newContract = {
      id: newTxId,
      crop,
      qty,
      amount: calculatedAmount,
      status: "Dispatched",
      eta: "3 days",
      origin: "Satara FPO coop",
      dest: "Mumbai Port Warehouse",
      carrier: "State Kisan Transport",
      date: new Date().toISOString().substring(0, 10),
    };
    setContracts([newContract, ...contracts]);

    // Add to ledger deposits
    const newEscrowHash = `ESC-${Math.floor(400 + Math.random() * 599)}-MH`;
    const newLedger = {
      txHash: newEscrowHash,
      type: "Lock Protection",
      crop,
      fpo: "Satara Farmers Coop",
      amount: calculatedAmount,
      date: new Date().toISOString().substring(0, 10),
      status: "LOCKED" as const,
    };
    setLedgerEntries([newLedger, ...ledgerEntries]);
    
    toast.success(`Procurement Contract Secured!`, {
      description: `Escrow value ₹${calculatedAmount.toLocaleString()} funded for ${qty} of ${crop}. FPO agent notified.`,
    });
  };

  const handleReleasePayment = (id: string) => {
    const contract = contracts.find(c => c.id === id);
    if (!contract) return;

    // Update contract status
    setContracts(contracts.map(c => c.id === id ? { ...c, status: "Delivered & Settled", eta: "Delivered" } : c));

    // Update corresponding ledger entry (change status from LOCKED to RELEASED)
    setLedgerEntries(ledgerEntries.map(l => 
      l.crop === contract.crop && l.amount === contract.amount && l.status === "LOCKED"
      ? { ...l, status: "RELEASED" }
      : l
    ));

    toast.success(`Funds Disbursed to FPO!`, {
      description: `₹${contract.amount.toLocaleString()} has been securely transferred to the FPO's Aadhaar linked DBT account. Transaction complete.`,
    });
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = parseInt(depositInput.replace(/\D/g, ""));
    if (isNaN(cleanAmt) || cleanAmt <= 0) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }

    setLoadingDeposit(true);
    setTimeout(() => {
      setLoadingDeposit(false);
      setDepositBalance(prev => prev + cleanAmt);
      
      const newDepHash = `DEP-${Math.floor(100 + Math.random() * 899)}-MH`;
      const newEntry = {
        txHash: newDepHash,
        type: "Wallet Deposit",
        crop: "N/A",
        fpo: "General Deposit Bank",
        amount: cleanAmt,
        date: new Date().toISOString().substring(0, 10),
        status: "SETTLED" as const,
      };
      setLedgerEntries([newEntry, ...ledgerEntries]);

      toast.success("Deposit Approved!", {
        description: `₹${cleanAmt.toLocaleString()} credited successfully to your AgriSphere trading wallet.`,
      });
      setDepositInput("");
    }, 1500);
  };

  const handleLogout = () => {
    toast.info("Logging out from wholesale portal...");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 800);
  };

  const filteredListings = listings.filter(l => 
    l.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.fpo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex text-sm">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="hidden lg:flex w-[300px] shrink-0 flex-col bg-sidebar border-r border-border p-6 justify-between">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm overflow-hidden p-1 bg-gradient-to-br from-white to-accent/40">
              <img src={logoImg} alt="AgriSphere AI Emblem" className="size-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <span className="text-primary font-extrabold">AgriSphere</span>{" "}
                <span className="text-tile-amber-icon font-black">Buyer</span>
              </h1>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5 font-medium">
                B2B Wholesale Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              Trading Workspaces
            </span>
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === "listings"
                  ? "bg-tile-amber/80 text-tile-amber-icon border border-tile-amber-icon/10"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <ShoppingBag className="size-4.5" />
              Wholesale Listings
            </button>
            <button 
              onClick={() => setActiveTab("contracts")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === "contracts"
                  ? "bg-tile-amber/80 text-tile-amber-icon border border-tile-amber-icon/10"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <Truck className="size-4.5 text-muted-foreground" />
              Contracts & Shipments
            </button>
            <button 
              onClick={() => setActiveTab("escrow")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === "escrow"
                  ? "bg-tile-amber/80 text-tile-amber-icon border border-tile-amber-icon/10"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <ShieldCheck className="size-4.5 text-muted-foreground" />
              Escrow Ledgers
            </button>
          </nav>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-2xl shadow-sm">
            <div className="size-10 rounded-xl bg-tile-amber flex items-center justify-center font-bold text-tile-amber-icon text-sm">
              BY
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">AgriProcure Corp</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">Licensed Wholesale Trader</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-650 hover:bg-red-750 text-destructive font-semibold border border-transparent rounded-xl text-xs transition cursor-pointer"
          >
            <LogOut className="size-4" />
            Switch / Exit Role
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 flex flex-col p-4 sm:p-8 lg:p-10 transition-all duration-300">
        
        {/* Header */}
        <header className="flex justify-between items-center gap-4 flex-wrap mb-8 pb-4 border-b border-border/40">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-tile-amber-icon flex items-center gap-2">
              <Handshake className="size-8 text-tile-amber-icon" />
              {activeTab === "listings" && "Wholesale crop procurement"}
              {activeTab === "contracts" && "Contracts & Shipment tracker"}
              {activeTab === "escrow" && "Secured Escrow Vault Ledger"}
            </h2>
            <p className="text-xs sm:text-xs text-muted-foreground mt-0.5 leading-snug">
              Secure contracts directly with verified Farmer Cooperatives. Audit soil certificates and lock funds in government cryptographically audited escrows.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Mobile Tab Select Links */}
            <div className="lg:hidden flex bg-white/80 p-0.5 border border-border rounded-xl">
              <button onClick={() => setActiveTab("listings")} className={`px-2 py-1 text-[10px] font-black rounded-lg ${activeTab === "listings" ? "bg-tile-amber text-tile-amber-icon" : "text-muted-foreground"}`}>Catalog</button>
              <button onClick={() => setActiveTab("contracts")} className={`px-2 py-1 text-[10px] font-black rounded-lg ${activeTab === "contracts" ? "bg-tile-amber text-tile-amber-icon" : "text-muted-foreground"}`}>Shipments</button>
              <button onClick={() => setActiveTab("escrow")} className={`px-2 py-1 text-[10px] font-black rounded-lg ${activeTab === "escrow" ? "bg-tile-amber text-tile-amber-icon" : "text-muted-foreground"}`}>Vault</button>
            </div>

            <button 
              onClick={handleLogout}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 border border-border/60 transition cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Roles
            </button>
            <div className="flex items-center gap-1.5 bg-white border border-border px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
              <MapPin className="size-3.5 text-primary animate-bounce" />
              Maharashtra Mandis locked
            </div>
          </div>
        </header>

        {/* Global Financial Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Escrow Locked Funds</span>
              <div className="text-2xl font-extrabold text-tile-amber-icon">₹{lockedBalance.toLocaleString()}</div>
            </div>
            <div className="size-10 rounded-xl bg-tile-amber flex items-center justify-center text-tile-amber-icon">
              <ShieldCheck className="size-6" />
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">General Trading Wallet</span>
              <div className="text-2xl font-extrabold text-primary">₹{depositBalance.toLocaleString()}</div>
            </div>
            <div className="size-10 rounded-xl bg-tile-green flex items-center justify-center text-tile-green-icon">
              <IndianRupee className="size-6" />
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">In-Transit Shipments</span>
              <div className="text-2xl font-extrabold text-foreground">
                {contracts.filter(c => c.status === "In Transit" || c.status === "Dispatched").length} Consignments
              </div>
            </div>
            <div className="size-10 rounded-xl bg-tile-blue flex items-center justify-center text-tile-blue-icon">
              <Truck className="size-6" />
            </div>
          </div>
        </div>

        {/* Dynamic Inner Tab Workspaces */}
        {activeTab === "listings" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start animate-fade-in">
            {/* Catalog list */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-primary">Verified FPO Harvesting Catalog</h3>
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      className="w-full pl-8 pr-3 py-1.5 border border-border rounded-xl text-xs bg-white focus:outline-none"
                      placeholder="Search crop, Coop..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Search className="size-3.5 absolute top-2.5 left-2.5 text-muted-foreground" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="py-2.5">ID</th>
                        <th>Harvest Produce</th>
                        <th>Cooperatives</th>
                        <th>Procure Vol</th>
                        <th>Expected Price Range</th>
                        <th>Quality Cert</th>
                        <th className="text-right">Escrow Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredListings.map((l, i) => (
                        <tr key={i} className="hover:bg-secondary/25 transition">
                          <td className="py-4 font-mono font-medium text-muted-foreground">{l.id}</td>
                          <td className="font-bold text-foreground">{l.crop}</td>
                          <td>{l.fpo}</td>
                          <td>{l.qty}</td>
                          <td className="font-semibold text-primary">{l.price}</td>
                          <td>
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-semibold">
                              <CheckCircle className="size-3" /> {l.cert}
                            </span>
                          </td>
                          <td className="text-right">
                            {l.status === "Available" ? (
                              <button
                                onClick={() => handleBuy(l.id, l.crop, l.qty, l.price)}
                                className="px-2.5 py-1 text-[10px] font-bold text-white bg-tile-amber-icon rounded-md hover:bg-tile-amber-icon/90 transition shadow-sm hover:scale-103 cursor-pointer"
                              >
                                Fund Escrow
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-primary font-bold uppercase">
                                <CheckCircle className="size-3 text-primary animate-ping" /> Locked
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick overview right column */}
            <div className="space-y-6">
              {/* Mini Tracker */}
              <div className="bg-white border border border-border rounded-3xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-primary mb-3">Procurement Quick-tracker</h3>
                <div className="space-y-3">
                  {contracts.slice(0, 2).map((c, i) => (
                    <div key={i} className="p-3 bg-secondary/30 border border-border rounded-xl flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-foreground">{c.crop} ({c.qty})</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">ID: {c.id}</p>
                        <div className="flex items-center gap-1.5 mt-2 bg-white px-2 py-1 rounded inline-block">
                          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[9px] font-bold text-muted-foreground text-primary">{c.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{c.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">ETA: {c.eta}</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab("contracts")} className="w-full text-center text-xs text-primary font-bold hover:underline flex items-center justify-center gap-1 mt-2">
                    View Complete Dispatch Queue <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 border border-dashed border-border bg-white rounded-3xl text-xs space-y-2">
                <h4 className="font-bold text-tile-blue-icon uppercase flex items-center gap-1.5">
                  <ShieldCheck className="size-4 shrink-0" />
                  Escrow Guarantee
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  AgriSphere holds deposit pools. Vault entries coordinate with the State Agriculture DBT network to guarantee pay-out only on physical delivery audits.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="space-y-6 animate-fade-in">
            {/* Shipment list */}
            <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Truck className="size-5 text-tile-amber-icon" /> Managed Consignments & Escrow Releases
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map((c, i) => (
                  <div key={i} className="p-4 bg-white border border-border rounded-2xl flex flex-col justify-between hover:shadow-md transition gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-tile-amber/40 text-[10px] text-tile-amber-icon rounded font-extrabold uppercase">{c.crop}</span>
                        <h4 className="text-sm font-bold text-foreground mt-1.5">{c.qty} Procurement Contract</h4>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{c.id} • Submitted: {c.date}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">₹{c.amount.toLocaleString()}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold mt-1.5 ${
                          c.status === "Delivered & Settled" 
                            ? "bg-green-50 text-green-700" 
                            : c.status === "In Transit" 
                            ? "bg-blue-50 text-blue-700" 
                            : "bg-amber-50 text-amber-700"
                        }`}>{c.status}</span>
                      </div>
                    </div>

                    {/* Routing */}
                    <div className="bg-secondary/40 rounded-xl p-3 text-[11px] grid grid-cols-3 items-center text-center">
                      <div>
                        <span className="text-[9px] text-muted-foreground block uppercase font-semibold">Origin</span>
                        <span className="font-bold text-foreground">{c.origin}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <Navigation className="size-4 text-primary rotate-90" />
                        <span className="text-[8px] text-muted-foreground mt-0.5 font-mono">{c.carrier}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground block uppercase font-semibold">Destination</span>
                        <span className="font-bold text-foreground">{c.dest}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Estimated Delivery</span>
                        <span className="text-xs font-bold text-foreground">{c.eta}</span>
                      </div>

                      {c.status !== "Delivered & Settled" ? (
                        <button
                          onClick={() => handleReleasePayment(c.id)}
                          className="px-3.5 py-1.5 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary/95 transition shadow-sm cursor-pointer"
                        >
                          Release Escrow Payout
                        </button>
                      ) : (
                        <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                          <CheckCircle className="size-4" /> Funds Released
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "escrow" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start animate-fade-in">
            {/* Ledger entries table */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white border border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-primary">Cryptographic Vault Audit History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="py-2.5">TX Hash</th>
                        <th>Type Name</th>
                        <th>Allocated Crop</th>
                        <th>FPO Beneficiary</th>
                        <th>Funds Weight</th>
                        <th>Stamp Date</th>
                        <th className="text-right">Ledger Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {ledgerEntries.map((e, idx) => (
                        <tr key={idx} className="hover:bg-secondary/25 transition">
                          <td className="py-3.5 font-mono font-medium text-muted-foreground">{e.txHash}</td>
                          <td className="font-bold text-foreground">{e.type}</td>
                          <td>
                            {e.crop !== "N/A" ? (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-tile-amber/40 text-[10px] text-tile-amber-icon font-medium">
                                {e.crop}
                              </span>
                            ) : (
                              <span className="text-muted-foreground font-semibold">—</span>
                            )}
                          </td>
                          <td className="font-medium text-foreground">{e.fpo}</td>
                          <td className="font-extrabold text-primary">₹{e.amount.toLocaleString()}</td>
                          <td>{e.date}</td>
                          <td className="text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                              e.status === "RELEASED" 
                                ? "bg-green-50 text-green-700" 
                                : e.status === "LOCKED" 
                                ? "bg-blue-50 text-blue-700 animate-pulse" 
                                : "bg-secondary text-foreground"
                            }`}>{e.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Deposit Section */}
            <div className="space-y-6">
              <div className="bg-white border border border-border rounded-3xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-primary mb-3">Deposit Funds to Wallet</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Add liquidity to your general wallet to instantly secure multi-ton crop lots.
                </p>

                <form onSubmit={handleDepositSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Deposit Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs text-muted-foreground font-semibold">₹</span>
                      <input
                        type="text"
                        required
                        className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-xs bg-white font-mono font-bold"
                        placeholder="e.g. 150000"
                        value={depositInput}
                        onChange={e => setDepositInput(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingDeposit}
                    className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loadingDeposit ? "Confirming Bank Settlement..." : "Lock Deposits into Vault"}
                  </button>
                </form>
              </div>

              {/* Policy note */}
              <div className="p-4 border border-dashed border-border bg-white rounded-3xl text-xs space-y-2">
                <h4 className="font-bold text-tile-amber-icon uppercase flex items-center gap-1.5">
                  <ShieldCheck className="size-4" /> SECURED Liquidity
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  All transactions use RBI sanctioned banking APIs. Vault audits are stored on a public state-regulated DBT agricultural ledger.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
