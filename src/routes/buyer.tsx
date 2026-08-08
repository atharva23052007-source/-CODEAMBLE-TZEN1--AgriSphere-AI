import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Handshake,
  ShieldCheck,
  CheckCircle,
  Truck,
  IndianRupee,
  LogOut,
  MapPin,
  Search,
  ShoppingBag,
  ArrowRight,
  Navigation,
  Plus,
  Store,
  AlertTriangle,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import logoImg from "@/assets/logo.png";
import { useTraderDB } from "../hooks/useTraderDB";
import type { ContractStatus } from "../lib/mockTraderDB";

export const Route = createFileRoute("/buyer")({
  component: BuyerDashboard,
});

type TraderTab = "listings" | "contracts" | "escrow";
type SellerTab = "my-listings" | "fulfillment";
type Role = "trader" | "seller";

function BuyerDashboard() {
  const navigate = useNavigate();
  const { state, deposit, addListing, buyListing, acceptContract, updateShipment, releaseEscrow } = useTraderDB();
  
  const [currentRole, setCurrentRole] = useState<Role>("trader");
  
  const [traderTab, setTraderTab] = useState<TraderTab>("listings");
  const [sellerTab, setSellerTab] = useState<SellerTab>("my-listings");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [depositInput, setDepositInput] = useState("");
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [processingActionId, setProcessingActionId] = useState<string | null>(null);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    id: string; crop: string; qty: string; price: string; cert: string; fpo: string;
  } | null>(null);

  // Seller Listing Form State
  const [newListing, setNewListing] = useState({
    crop: "",
    qty: "",
    price: "",
    cert: "",
    location: "",
  });
  const [priceUnit, setPriceUnit] = useState("Quintal");
  const [certType, setCertType] = useState("");

  const PRICE_UNITS = ["Quintal", "Ton", "Kg", "Metric Ton (MT)", "Acre"];
  const CERT_OPTIONS = [
    "Organic Certified (NPOP)",
    "Quality Grade-A A+ Passed",
    "AGMARK Graded",
    "ISO 22000 Food Safety",
    "FSSAI Compliant",
    "GlobalG.A.P Certified",
    "Fair Trade Certified",
    "Residue-Free Certified",
    "Non-GMO Verified",
    "India Organic Certificate",
  ];

  // Current Users
  const TRADER_ID = "trader_1";
  const SELLER_ID = "seller_1";

  // Filtered Data
  const traderBalance = state.balances[TRADER_ID] || 0;
  const sellerBalance = state.balances[SELLER_ID] || 0;

  const availableListings = state.listings; // Trader sees all (in a real app, maybe only 'Available')
  const myListings = state.listings.filter(l => l.sellerId === SELLER_ID);
  
  const traderContracts = state.contracts.filter(c => c.buyerId === TRADER_ID);
  const sellerContracts = state.contracts.filter(c => c.sellerId === SELLER_ID);

  const traderLedgers = state.ledgers.filter(l => l.userId === TRADER_ID);

  const lockedBalance = traderContracts
    .filter(c => c.status !== "Delivered & Settled")
    .reduce((sum, c) => sum + c.amount, 0);

  const filteredAvailableListings = availableListings.filter(l => 
    l.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.fpo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---- TRADER ACTIONS ----
  const openConfirm = (l: { id: string; crop: string; qty: string; price: string; cert: string; fpo: string }) => {
    if (processingActionId) return;
    setConfirmModal(l);
  };

  const confirmBuy = async () => {
    if (!confirmModal || processingActionId) return;
    const { id, crop, qty } = confirmModal;
    setConfirmModal(null);
    setProcessingActionId(id);
    try {
      await buyListing(id, TRADER_ID);
      toast.success(`Procurement Contract Secured!`, {
        description: `Escrow funded for ${qty} of ${crop}. FPO agent notified.`,
      });
    } catch (e: any) {
      toast.error(e.message || "Insufficient funds in general deposit vault!", {
        description: "Please deposit funds first.",
      });
      setTraderTab("escrow");
    } finally {
      setProcessingActionId(null);
    }
  };

  const handleReleasePayment = async (id: string) => {
    if (processingActionId) return;
    setProcessingActionId(id);
    try {
      await releaseEscrow(id, TRADER_ID);
      toast.success(`Funds Disbursed to FPO!`, {
        description: `Payment has been securely transferred. Transaction complete.`,
      });
    } finally {
      setProcessingActionId(null);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingDeposit) return;
    const cleanAmt = parseInt(depositInput.replace(/\D/g, ""));
    if (isNaN(cleanAmt) || cleanAmt <= 0) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }

    setLoadingDeposit(true);
    try {
      await deposit(TRADER_ID, cleanAmt);
      toast.success("Deposit Approved!", {
        description: `₹${cleanAmt.toLocaleString()} credited successfully to your AgriSphere trading wallet.`,
      });
      setDepositInput("");
    } finally {
      setLoadingDeposit(false);
    }
  };

  // ---- SELLER ACTIONS ----
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingListing) return;
    if (!newListing.crop.trim()) {
      toast.error("Please enter a crop type.");
      return;
    }
    setIsSubmittingListing(true);
    try {
      const composedPrice = newListing.price ? `₹${newListing.price.replace(/[₹,]/g, "")} / ${priceUnit}` : "";
      const composedCert = certType || newListing.cert;
      await addListing({
        ...newListing,
        price: composedPrice,
        cert: composedCert,
        fpo: "Satara Farmers Coop",
        sellerId: SELLER_ID,
      });
      toast.success("Harvest Listing Published!");
      setNewListing({ crop: "", qty: "", price: "", cert: "", location: "" });
      setCertType("");
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const handleAcceptContract = async (id: string) => {
    if (processingActionId) return;
    setProcessingActionId(id);
    try {
      await acceptContract(id, SELLER_ID);
      toast.success("Contract Accepted", { description: "You can now dispatch the shipment." });
    } finally {
      setProcessingActionId(null);
    }
  };

  const handleUpdateShipment = async (id: string, newStatus: ContractStatus) => {
    if (processingActionId) return;
    setProcessingActionId(id);
    try {
      await updateShipment(id, SELLER_ID, newStatus);
      toast.success(`Shipment updated to ${newStatus}`);
    } finally {
      setProcessingActionId(null);
    }
  };

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 800);
  };

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
                <span className={currentRole === 'trader' ? "text-tile-amber-icon font-black" : "text-tile-green-icon font-black"}>
                  {currentRole === 'trader' ? 'Trader' : 'Seller'}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5 font-medium">
                B2B Wholesale Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {currentRole === 'trader' ? 'Trading Workspaces' : 'Seller Workspaces'}
            </span>
            
            {currentRole === 'trader' ? (
              <>
                <button
                  onClick={() => setTraderTab("listings")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    traderTab === "listings"
                      ? "bg-tile-amber/80 text-tile-amber-icon border border-tile-amber-icon/10"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <ShoppingBag className="size-4.5" />
                  Wholesale Listings
                </button>
                <button 
                  onClick={() => setTraderTab("contracts")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    traderTab === "contracts"
                      ? "bg-tile-amber/80 text-tile-amber-icon border border-tile-amber-icon/10"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Truck className="size-4.5 text-muted-foreground" />
                  Contracts & Shipments
                </button>
                <button 
                  onClick={() => setTraderTab("escrow")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    traderTab === "escrow"
                      ? "bg-tile-amber/80 text-tile-amber-icon border border-tile-amber-icon/10"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <ShieldCheck className="size-4.5 text-muted-foreground" />
                  Escrow Ledgers
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSellerTab("my-listings")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    sellerTab === "my-listings"
                      ? "bg-tile-green/80 text-tile-green-icon border border-tile-green-icon/10"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Store className="size-4.5" />
                  My Harvest Listings
                </button>
                <button 
                  onClick={() => setSellerTab("fulfillment")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    sellerTab === "fulfillment"
                      ? "bg-tile-green/80 text-tile-green-icon border border-tile-green-icon/10"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Truck className="size-4.5 text-muted-foreground" />
                  Fulfillment Queue
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Profile Card & Role Switcher */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-2xl shadow-sm">
            <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm ${currentRole === 'trader' ? 'bg-tile-amber text-tile-amber-icon' : 'bg-tile-green text-tile-green-icon'}`}>
              {currentRole === 'trader' ? 'TR' : 'SL'}
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">{currentRole === 'trader' ? 'AgriProcure Corp' : 'Satara Farmers Coop'}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">{currentRole === 'trader' ? 'Licensed Wholesale Trader' : 'Verified FPO Seller'}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentRole(currentRole === 'trader' ? 'seller' : 'trader')}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Switch to {currentRole === 'trader' ? 'Seller (FPO)' : 'Trader (Buyer)'} View
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-650 hover:bg-red-750 text-destructive font-semibold border border-transparent rounded-xl text-xs transition cursor-pointer"
          >
            <LogOut className="size-4" />
            Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 flex flex-col p-4 sm:p-8 lg:p-10 transition-all duration-300 h-screen overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center gap-4 flex-wrap mb-8 pb-4 border-b border-border/40">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold flex items-center gap-2 ${currentRole === 'trader' ? 'text-tile-amber-icon' : 'text-tile-green-icon'}`}>
              {currentRole === 'trader' ? (
                <>
                  <Handshake className="size-8" />
                  {traderTab === "listings" && "Wholesale crop procurement"}
                  {traderTab === "contracts" && "Contracts & Shipment tracker"}
                  {traderTab === "escrow" && "Secured Escrow Vault Ledger"}
                </>
              ) : (
                <>
                  <Store className="size-8" />
                  {sellerTab === "my-listings" && "My Harvest Listings"}
                  {sellerTab === "fulfillment" && "Fulfillment & Orders"}
                </>
              )}
            </h2>
            <p className="text-xs sm:text-xs text-muted-foreground mt-0.5 leading-snug">
              {currentRole === 'trader' 
                ? "Secure contracts directly with verified Farmer Cooperatives. Audit soil certificates and lock funds."
                : "Manage your cooperative's produce listings and fulfill incoming escrow-backed orders."}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white border border-border px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
              <MapPin className="size-3.5 text-primary animate-bounce" />
              Maharashtra Mandis
            </div>
          </div>
        </header>

        {/* Global Financial Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                {currentRole === 'trader' ? 'Escrow Locked Funds' : 'Pending Fulfillment Value'}
              </span>
              <div className="text-2xl font-extrabold text-tile-amber-icon">
                ₹{currentRole === 'trader' 
                  ? lockedBalance.toLocaleString() 
                  : sellerContracts.filter(c => c.status !== 'Delivered & Settled').reduce((s, c) => s + c.amount, 0).toLocaleString()}
              </div>
            </div>
            <div className="size-10 rounded-xl bg-tile-amber flex items-center justify-center text-tile-amber-icon">
              <ShieldCheck className="size-6" />
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                {currentRole === 'trader' ? 'General Trading Wallet' : 'Settled Earnings'}
              </span>
              <div className="text-2xl font-extrabold text-primary">
                ₹{currentRole === 'trader' ? traderBalance.toLocaleString() : sellerBalance.toLocaleString()}
              </div>
            </div>
            <div className="size-10 rounded-xl bg-tile-green flex items-center justify-center text-tile-green-icon">
              <IndianRupee className="size-6" />
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Active Consignments</span>
              <div className="text-2xl font-extrabold text-foreground">
                {currentRole === 'trader' 
                  ? traderContracts.filter(c => c.status !== "Delivered & Settled").length
                  : sellerContracts.filter(c => c.status !== "Delivered & Settled").length} Consignments
              </div>
            </div>
            <div className="size-10 rounded-xl bg-tile-blue flex items-center justify-center text-tile-blue-icon">
              <Truck className="size-6" />
            </div>
          </div>
        </div>

        {/* TRADER VIEWS */}
        {currentRole === 'trader' && (
          <>
            {traderTab === "listings" && (
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
                          {filteredAvailableListings.map((l, i) => (
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
                                    disabled={processingActionId === l.id}
                                    onClick={() => openConfirm(l)}
                                    className={`px-2.5 py-1 text-[10px] font-bold text-white bg-tile-amber-icon rounded-md transition shadow-sm cursor-pointer ${
                                      processingActionId === l.id ? "opacity-50 cursor-not-allowed" : "hover:bg-tile-amber-icon/90 hover:scale-103"
                                    }`}
                                  >
                                    {processingActionId === l.id ? "Funding..." : "Fund Escrow"}
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-primary font-bold uppercase">
                                    <CheckCircle className="size-3 text-primary" /> {l.status}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                          {filteredAvailableListings.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-6 text-center text-muted-foreground">No listings available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Quick overview right column */}
                <div className="space-y-6">
                  <div className="bg-white border border border-border rounded-3xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-primary mb-3">Procurement Quick-tracker</h3>
                    <div className="space-y-3">
                      {traderContracts.slice(0, 2).map((c, i) => (
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
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setTraderTab("contracts")} className="w-full text-center text-xs text-primary font-bold hover:underline flex items-center justify-center gap-1 mt-2">
                        View Complete Dispatch Queue <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border border-dashed border-border bg-white rounded-3xl text-xs space-y-2">
                    <h4 className="font-bold text-tile-blue-icon uppercase flex items-center gap-1.5">
                      <ShieldCheck className="size-4 shrink-0" /> Escrow Guarantee
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      AgriSphere holds deposit pools. Vault entries coordinate with the State Agriculture DBT network to guarantee pay-out only on physical delivery audits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {traderTab === "contracts" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Truck className="size-5 text-tile-amber-icon" /> Managed Consignments & Escrow Releases
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {traderContracts.map((c, i) => (
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
                              c.status === "Delivered & Settled" ? "bg-green-50 text-green-700" :
                              c.status === "In Transit" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                            }`}>{c.status}</span>
                          </div>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-3 text-[11px] grid grid-cols-3 items-center text-center">
                          <div>
                            <span className="text-[9px] text-muted-foreground block uppercase font-semibold">Origin</span>
                            <span className="font-bold text-foreground">{c.origin}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <Navigation className="size-4 text-primary rotate-90" />
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block uppercase font-semibold">Destination</span>
                            <span className="font-bold text-foreground">{c.dest}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-3">
                          {c.status === "In Transit" || c.status === "Dispatched" ? (
                            <button
                              disabled={processingActionId === c.id}
                              onClick={() => handleReleasePayment(c.id)}
                              className={`px-3.5 py-1.5 text-xs font-bold bg-primary text-white rounded-xl transition shadow-sm cursor-pointer ml-auto ${
                                processingActionId === c.id ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/95"
                              }`}
                            >
                              {processingActionId === c.id ? "Processing..." : "Mark Delivered & Release Escrow"}
                            </button>
                          ) : c.status === "Delivered & Settled" ? (
                            <span className="text-[10px] text-green-700 font-bold flex items-center gap-1 ml-auto">
                              <CheckCircle className="size-4" /> Funds Released
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-bold ml-auto">Waiting for Shipment</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {traderContracts.length === 0 && <p className="text-muted-foreground text-sm col-span-2">No contracts found.</p>}
                  </div>
                </div>
              </div>
            )}

            {traderTab === "escrow" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start animate-fade-in">
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
                            <th>Funds Weight</th>
                            <th>Stamp Date</th>
                            <th className="text-right">Ledger Code</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {traderLedgers.map((e, idx) => (
                            <tr key={idx} className="hover:bg-secondary/25 transition">
                              <td className="py-3.5 font-mono font-medium text-muted-foreground">{e.txHash}</td>
                              <td className="font-bold text-foreground">{e.type}</td>
                              <td>{e.crop}</td>
                              <td className="font-extrabold text-primary">₹{e.amount.toLocaleString()}</td>
                              <td>{e.date}</td>
                              <td className="text-right">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                                  e.status === "RELEASED" || e.status === "SETTLED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700 animate-pulse"
                                }`}>{e.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white border border border-border rounded-3xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-primary mb-3">Deposit Funds to Wallet</h3>
                    <p className="text-xs text-muted-foreground mb-4">Add liquidity to your general wallet to instantly secure multi-ton crop lots.</p>
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
                        {loadingDeposit ? "Confirming..." : "Lock Deposits into Vault"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* SELLER VIEWS */}
        {currentRole === 'seller' && (
          <>
            {sellerTab === "my-listings" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start animate-fade-in">
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-white border border border-border rounded-3xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2"><Plus className="size-4"/> Publish New Harvest</h3>
                    <form onSubmit={handleCreateListing} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Crop Type</label>
                        <input required type="text" className="w-full px-3 py-2 border border-border rounded-xl text-xs bg-white" placeholder="e.g. Premium Cotton" value={newListing.crop} onChange={e => setNewListing({...newListing, crop: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Quantity</label>
                        <input required type="text" className="w-full px-3 py-2 border border-border rounded-xl text-xs bg-white" placeholder="e.g. 50 Tons" value={newListing.qty} onChange={e => setNewListing({...newListing, qty: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Expected Price</label>
                        <div className="flex gap-1.5">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-muted-foreground font-semibold pointer-events-none">₹</span>
                            <input
                              required
                              type="text"
                              inputMode="numeric"
                              className="w-full pl-6 pr-3 py-2 border border-border rounded-xl text-xs bg-white font-mono font-semibold"
                              placeholder="5000"
                              value={newListing.price}
                              onChange={e => setNewListing({...newListing, price: e.target.value.replace(/[^0-9,.]/g, "")})}
                            />
                          </div>
                          <select
                            value={priceUnit}
                            onChange={e => setPriceUnit(e.target.value)}
                            className="px-2 py-2 border border-border rounded-xl text-xs bg-white font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-2"
                            style={{ minWidth: "110px" }}
                          >
                            {PRICE_UNITS.map(u => (
                              <option key={u} value={u}>/ {u}</option>
                            ))}
                          </select>
                        </div>
                        {newListing.price && (
                          <p className="text-[10px] text-primary font-semibold mt-1 ml-1">
                            Preview: ₹{newListing.price} / {priceUnit}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Quality Certificate</label>
                        <select
                          required
                          value={certType}
                          onChange={e => setCertType(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-xl text-xs bg-white font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-2"
                        >
                          <option value="" disabled>Select certificate type…</option>
                          {CERT_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Pickup Location</label>
                        <input required type="text" className="w-full px-3 py-2 border border-border rounded-xl text-xs bg-white" placeholder="e.g. Satara Warehouse" value={newListing.location} onChange={e => setNewListing({...newListing, location: e.target.value})} />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingListing}
                        className={`w-full h-10 bg-tile-green text-tile-green-icon text-xs font-bold rounded-xl transition shadow-sm cursor-pointer ${
                          isSubmittingListing ? "opacity-50 cursor-not-allowed" : "hover:bg-tile-green/80"
                        }`}
                      >
                        {isSubmittingListing ? "Publishing..." : "Publish to Wholesale Catalog"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-primary">My Harvest Listings</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-semibold">
                            <th className="py-2.5">ID</th>
                            <th>Crop</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Certificate</th>
                            <th className="text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {myListings.map((l, i) => (
                            <tr key={i} className="hover:bg-secondary/25 transition">
                              <td className="py-4 font-mono font-medium text-muted-foreground">{l.id}</td>
                              <td className="font-bold text-foreground">{l.crop}</td>
                              <td>{l.qty}</td>
                              <td className="font-semibold text-primary">{l.price}</td>
                              <td>{l.cert}</td>
                              <td className="text-right font-bold text-primary">{l.status}</td>
                            </tr>
                          ))}
                          {myListings.length === 0 && (
                            <tr><td colSpan={6} className="py-4 text-center text-muted-foreground">No listings published yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sellerTab === "fulfillment" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Truck className="size-5 text-tile-green-icon" /> Fulfillment Queue & Active Orders
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sellerContracts.map((c, i) => (
                      <div key={i} className="p-4 bg-white border border-border rounded-2xl flex flex-col justify-between hover:shadow-md transition gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 bg-tile-green/40 text-[10px] text-tile-green-icon rounded font-extrabold uppercase">{c.crop}</span>
                            <h4 className="text-sm font-bold text-foreground mt-1.5">{c.qty} Order</h4>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Contract: {c.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-primary">₹{c.amount.toLocaleString()}</p>
                            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold mt-1.5 bg-blue-50 text-blue-700">{c.status}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                          {c.status === "Escrow Locked" && (
                            <button
                              disabled={processingActionId === c.id}
                              onClick={() => handleAcceptContract(c.id)}
                              className={`px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-xl cursor-pointer ${
                                processingActionId === c.id ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/95"
                              }`}
                            >
                              {processingActionId === c.id ? "Accepting..." : "Accept & Prepare"}
                            </button>
                          )}
                          {c.status === "Seller Accepts" && (
                            <button
                              disabled={processingActionId === c.id}
                              onClick={() => handleUpdateShipment(c.id, "Dispatched")}
                              className={`px-3 py-1.5 text-xs font-bold bg-tile-amber text-tile-amber-icon rounded-xl cursor-pointer ${
                                processingActionId === c.id ? "opacity-50 cursor-not-allowed" : "hover:bg-tile-amber/80"
                              }`}
                            >
                              {processingActionId === c.id ? "Updating..." : "Mark Dispatched"}
                            </button>
                          )}
                          {c.status === "Dispatched" && (
                            <button
                              disabled={processingActionId === c.id}
                              onClick={() => handleUpdateShipment(c.id, "In Transit")}
                              className={`px-3 py-1.5 text-xs font-bold bg-tile-blue text-tile-blue-icon rounded-xl cursor-pointer ${
                                processingActionId === c.id ? "opacity-50 cursor-not-allowed" : "hover:bg-tile-blue/80"
                              }`}
                            >
                              {processingActionId === c.id ? "Updating..." : "Mark In Transit"}
                            </button>
                          )}
                          {(c.status === "In Transit" || c.status === "Delivered & Settled") && (
                            <span className="text-xs text-muted-foreground font-bold">Waiting for Buyer confirmation</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {sellerContracts.length === 0 && <p className="text-muted-foreground text-sm col-span-2">No active orders in the queue.</p>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* ── ESCROW CONFIRMATION MODAL ── */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, oklch(0.75 0.18 80), oklch(0.65 0.20 50))" }} />

            {/* Close button */}
            <button
              onClick={() => setConfirmModal(null)}
              className="absolute top-4 right-4 size-7 flex items-center justify-center rounded-full bg-secondary hover:bg-border transition cursor-pointer"
            >
              <X className="size-3.5 text-muted-foreground" />
            </button>

            <div className="p-6 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="size-10 shrink-0 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="size-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground leading-tight">
                    Confirm Escrow Funding
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    Are you sure you want to lock funds for this procurement?
                  </p>
                </div>
              </div>

              {/* Listing Details Card */}
              <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Listing ID</span>
                  <span className="font-mono font-bold text-foreground">{confirmModal.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Crop / Produce</span>
                  <span className="font-bold text-foreground">{confirmModal.crop}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Cooperative (FPO)</span>
                  <span className="font-semibold text-foreground">{confirmModal.fpo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Quantity</span>
                  <span className="font-bold text-foreground">{confirmModal.qty}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2.5">
                  <span className="text-muted-foreground font-semibold">Expected Price</span>
                  <span className="font-extrabold text-primary text-sm">{confirmModal.price}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground font-semibold">Quality Cert</span>
                  <span className="text-right font-semibold text-green-700 max-w-[55%]">{confirmModal.cert}</span>
                </div>
              </div>

              {/* Warning note */}
              <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <ShieldCheck className="size-3.5 mt-0.5 shrink-0 text-amber-600" />
                <span>Funds will be locked in the AgriSphere Escrow Vault and released only upon verified delivery confirmation.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 h-10 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBuy}
                  className="flex-1 h-10 rounded-xl text-xs font-bold text-white transition shadow-sm cursor-pointer hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(90deg, oklch(0.72 0.18 80), oklch(0.62 0.20 50))" }}
                >
                  ✓ Yes, Fund Escrow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
