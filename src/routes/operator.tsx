import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Users,
  FileCheck,
  IndianRupee,
  Plus,
  CheckCircle,
  Clock,
  LogOut,
  ChevronRight,
  TrendingUp,
  MapPin,
  Bell,
  Search,
  Filter,
  Eye,
  FileText,
  AlertCircle,
  Landmark,
  BadgeAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/operator")({
  component: OperatorDashboard,
});

type TabType = "registry" | "land" | "dbt";

function OperatorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("registry");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Farmers registry database
  const [farmers, setFarmers] = useState([
    { id: "F-102", name: "Rajesh Patil", land: 5.5, crop: "Soybean", village: "Satara", status: "Verified", dbtStatus: "Linked", aadhaarSeeded: "Verified ✓", bank: "SBI ****092", schemes: ["PM-Kisan", "Fasal Bima"] },
    { id: "F-103", name: "Sanjay Deshmukh", land: 8.2, crop: "Sugarcane", village: "Satara", status: "Verified", dbtStatus: "Processing", aadhaarSeeded: "Verified ✓", bank: "MGB ****114", schemes: ["PM-Kisan"] },
    { id: "F-104", name: "Ramesh Pawar", land: 3.1, crop: "Cotton", village: "Wai", status: "Pending", dbtStatus: "Failed", aadhaarSeeded: "Not Seeded ⚠", bank: "BOI ****896", schemes: [] },
    { id: "F-105", name: "Ananda Shinde", land: 6.0, crop: "Wheat", village: "Koregaon", status: "Verified", dbtStatus: "Linked", aadhaarSeeded: "Verified ✓", bank: "SBI ****312", schemes: ["PM-Kisan", "Solar Pump"] },
    { id: "F-106", name: "Dilip Mohite", land: 4.5, crop: "Soybean", village: "Wai", status: "Pending", dbtStatus: "Unapplied", aadhaarSeeded: "Verified ✓", bank: "HDFC ****551", schemes: [] },
  ]);

  // Land extracts detailed database
  const [landExtracts, setLandExtracts] = useState([
    { id: "LND-201", farmerId: "F-102", farmerName: "Rajesh Patil", surveyNo: "145/2/A", acreage: 5.5, soil: "Black Cotton Soil (High Organic)", cropSuitability: "Excellent for Soybean & Cotton", file: "7-12-SATARA-145.pdf", inspected: true },
    { id: "LND-202", farmerId: "F-103", farmerName: "Sanjay Deshmukh", surveyNo: "88/1/B", acreage: 8.2, soil: "Alluvial Clay loam (Loamy)", cropSuitability: "Ideal for Sugarcane & Wheat", file: "7-12-SATARA-88.pdf", inspected: true },
    { id: "LND-203", farmerId: "F-104", farmerName: "Ramesh Pawar", surveyNo: "201/C", acreage: 3.1, soil: "Red Sandy Soil (Low Moisture)", cropSuitability: "Moderate for Cotton, requires irrigation", file: "7-12-WAI-201.pdf", inspected: false },
    { id: "LND-204", farmerId: "F-105", farmerName: "Ananda Shinde", surveyNo: "542/3", acreage: 6.0, soil: "Deep Silt loam (Rich Nitrogen)", cropSuitability: "Excellent for Wheat & Gram pulses", file: "7-12-KORG-542.pdf", inspected: true },
    { id: "LND-205", farmerId: "F-106", farmerName: "Dilip Mohite", surveyNo: "90/A", acreage: 4.5, soil: "Sandy Loam", cropSuitability: "Good for Oilseeds & Soybean", file: "7-12-WAI-90.pdf", inspected: false },
  ]);

  // Selected land extract for modal inspection
  const [inspectingLand, setInspectingLand] = useState<typeof landExtracts[0] | null>(null);

  // New Farmer Form Inputs
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerLand, setNewFarmerLand] = useState("");
  const [newFarmerCrop, setNewFarmerCrop] = useState("Soybean");
  const [newFarmerVillage, setNewFarmerVillage] = useState("");
  const [newFarmerBank, setNewFarmerBank] = useState("SBI ****221");

  // Scheme Linking loaders state
  const [linkingSchemeId, setLinkingSchemeId] = useState<string | null>(null);

  const handleAddFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmerName || !newFarmerLand || !newFarmerVillage) {
      toast.error("Please fill in all farmer details.");
      return;
    }
    const newId = `F-${Math.floor(100 + Math.random() * 899)}`;
    const acreageNum = parseFloat(newFarmerLand);
    const newF = {
      id: newId,
      name: newFarmerName,
      land: acreageNum,
      crop: newFarmerCrop,
      village: newFarmerVillage,
      status: "Pending",
      dbtStatus: "Unapplied",
      aadhaarSeeded: "Verified ✓",
      bank: newFarmerBank,
      schemes: [],
    };
    setFarmers([newF, ...farmers]);

    // Automatically create a corresponding land record
    const newL = {
      id: `LND-${Math.floor(200 + Math.random() * 799)}`,
      farmerId: newId,
      farmerName: newFarmerName,
      surveyNo: `${Math.floor(100 + Math.random() * 400)}/A`,
      acreage: acreageNum,
      soil: "Medium Black (Uninspected)",
      cropSuitability: `Suitable for ${newFarmerCrop}`,
      file: `7-12-TEMP-${newId}.pdf`,
      inspected: false,
    };
    setLandExtracts([newL, ...landExtracts]);

    toast.success(`Successfully enrolled ${newFarmerName} in FPO Registry!`);
    setNewFarmerName("");
    setNewFarmerLand("");
    setNewFarmerVillage("");
  };

  const verifyFarmer = (id: string, name: string) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, status: "Verified" } : f));
    // Set matching land records to inspected
    setLandExtracts(landExtracts.map(l => l.farmerId === id ? { ...l, inspected: true } : l));
    toast.success(`Land registry details verified for ${name}!`);
  };

  const handleModalApprove = () => {
    if (!inspectingLand) return;
    verifyFarmer(inspectingLand.farmerId, inspectingLand.farmerName);
    setLandExtracts(landExtracts.map(l => l.id === inspectingLand.id ? { ...l, inspected: true } : l));
    setInspectingLand(null);
  };

  const handleLinkScheme = (farmerId: string, schemeName: string) => {
    setLinkingSchemeId(`${farmerId}-${schemeName}`);
    setTimeout(() => {
      setFarmers(farmers.map(f => {
        if (f.id === farmerId) {
          const updatedSchemes = f.schemes.includes(schemeName) ? f.schemes : [...f.schemes, schemeName];
          return { ...f, schemes: updatedSchemes, dbtStatus: "Linked" };
        }
        return f;
      }));
      setLinkingSchemeId(null);
      toast.success(`Direct Benefit Transfer (DBT) scheme successfully linked!`, {
        description: `Linked ${schemeName} for the benefit account of farmer. Payout cycles synchronized.`,
      });
    }, 1200);
  };

  const handleLogout = () => {
    toast.info("Logging out from FPO Operator session...");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 800);
  };

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals calculations
  const totalLandManaged = farmers.reduce((sum, f) => sum + f.land, 0);

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
                <span className="text-tile-blue-icon font-black">FPO</span>
              </h1>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5 font-medium">
                Operator Workspace
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              FPO Operations
            </span>
            <button
              onClick={() => setActiveTab("registry")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === "registry"
                  ? "bg-accent text-primary border border-primary/10"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <Users className="size-4.5" />
              Farmer Registry
            </button>
            <button 
              onClick={() => setActiveTab("land")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === "land"
                  ? "bg-accent text-primary border border-primary/10"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <FileCheck className="size-4.5 text-muted-foreground" />
              Land Records (7/12)
            </button>
            <button 
              onClick={() => setActiveTab("dbt")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === "dbt"
                  ? "bg-accent text-primary border border-primary/10"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <IndianRupee className="size-4.5 text-muted-foreground" />
              DBT Scheme Aid Links
            </button>
          </nav>
        </div>

        {/* User profile & Log Out */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-2xl shadow-sm">
            <div className="size-10 rounded-xl bg-tile-blue flex items-center justify-center font-bold text-tile-blue-icon">
              SO
            </div>
            <div>
              <p className="text-xs font-bold">Satara Officer</p>
              <p className="text-[10px] text-muted-foreground">FPO Operator #12-D</p>
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary flex items-center gap-2">
              <Building2 className="size-8 text-tile-blue-icon" />
              {activeTab === "registry" && "Satara FPO Member Registry"}
              {activeTab === "land" && "Digital Land Record Extracts (7/12)"}
              {activeTab === "dbt" && "Aadhaar DBT scheme coordination"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Access DBT land extract verification and coordinate state fertilizer subsidies.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Mobile Navigation Toggles */}
            <div className="lg:hidden flex bg-white/80 p-0.5 border border-border rounded-xl">
              <button onClick={() => setActiveTab("registry")} className={`px-2 py-1 text-[10px] font-black rounded-lg ${activeTab === "registry" ? "bg-accent text-primary" : "text-muted-foreground"}`}>Members</button>
              <button onClick={() => setActiveTab("land")} className={`px-2 py-1 text-[10px] font-black rounded-lg ${activeTab === "land" ? "bg-accent text-primary" : "text-muted-foreground"}`}>Extracts</button>
              <button onClick={() => setActiveTab("dbt")} className={`px-2 py-1 text-[10px] font-black rounded-lg ${activeTab === "dbt" ? "bg-accent text-primary" : "text-muted-foreground"}`}>DBT</button>
            </div>

            <button 
              onClick={handleLogout}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 border border-border/60 transition cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Roles
            </button>
            <div className="flex items-center gap-1.5 bg-white border border-border px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
              <MapPin className="size-3.5 text-primary" />
              Satara block office
            </div>
          </div>
        </header>

        {/* Global FPO Registry KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Assisted Members</span>
              <div className="text-2xl font-extrabold text-foreground">{farmers.length} Farmers</div>
            </div>
            <div className="size-10 rounded-xl bg-tile-blue flex items-center justify-center text-tile-blue-icon">
              <Users className="size-5.5" />
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Cooperative Acreage</span>
              <div className="text-2xl font-extrabold text-primary">{totalLandManaged.toFixed(1)} Acres</div>
            </div>
            <div className="size-10 rounded-xl bg-tile-green flex items-center justify-center text-tile-green-icon">
              <TrendingUp className="size-5.5" />
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">DBT Verification Ratio</span>
              <div className="text-2xl font-extrabold text-foreground">
                {farmers.filter(f => f.status === "Verified").length} / {farmers.length} Verified
              </div>
            </div>
            <div className="size-10 rounded-xl bg-tile-violet flex items-center justify-center text-tile-violet-icon">
              <FileCheck className="size-5.5" />
            </div>
          </div>
        </div>

        {/* Dynamic Pages */}
        {activeTab === "registry" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start animate-fade-in">
            {/* Main farmers table */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-primary">Member Status Tracking</h3>
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      className="w-full pl-8 pr-3 py-1.5 border border-border rounded-xl text-xs bg-white focus:outline-none"
                      placeholder="Search ID, Name, Crop..."
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
                        <th>Farmer Name</th>
                        <th>Land size</th>
                        <th>Crop Type</th>
                        <th>Village</th>
                        <th>Status</th>
                        <th>DBT Registry</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredFarmers.map((f, i) => (
                        <tr key={i} className="hover:bg-secondary/25 transition">
                          <td className="py-3 font-mono font-medium text-muted-foreground">{f.id}</td>
                          <td className="font-bold text-foreground">{f.name}</td>
                          <td>{f.land} Acres</td>
                          <td>
                            <span className="inline-block px-2 py-0.5 rounded bg-tile-green/50 text-[10px] text-primary font-bold">
                              {f.crop}
                            </span>
                          </td>
                          <td>{f.village}</td>
                          <td>
                            {f.status === "Verified" ? (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold">
                                <CheckCircle className="size-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold">
                                <Clock className="size-3 animate-pulse" /> Pending
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`font-semibold ${
                              f.dbtStatus === "Linked" ? "text-primary" : f.dbtStatus === "Processing" ? "text-tile-blue-icon animate-pulse" : f.dbtStatus === "Failed" ? "text-red-500" : "text-muted-foreground"
                            }`}>{f.dbtStatus}</span>
                          </td>
                          <td className="text-right">
                            {f.status === "Pending" ? (
                              <button
                                onClick={() => verifyFarmer(f.id, f.name)}
                                className="px-2 py-1 text-[10px] font-bold text-white bg-primary rounded hover:bg-primary/95 transition cursor-pointer"
                              >
                                Verify Land
                              </button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground font-semibold">Synced ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right enrollment panel */}
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-3xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-1.5">
                  <Plus className="size-4.5 text-tile-blue-icon" /> Enroll New Farmer
                </h3>
                <form onSubmit={handleAddFarmer} className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Farmer Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-border rounded-xl px-3 py-1.5 text-xs bg-white"
                      placeholder="e.g. Maruti Kadam"
                      value={newFarmerName}
                      onChange={e => setNewFarmerName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Land Size (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="w-full border border-border rounded-xl px-3 py-1.5 text-xs bg-white"
                        placeholder="e.g. 4.2"
                        value={newFarmerLand}
                        onChange={e => setNewFarmerLand(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Primary Crop</label>
                      <select
                        className="w-full border border-border rounded-xl px-3 py-1.5 text-xs bg-white font-medium"
                        value={newFarmerCrop}
                        onChange={e => setNewFarmerCrop(e.target.value)}
                      >
                        <option value="Soybean">Soybean</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Wheat">Wheat</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Village Location</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border rounded-xl px-3 py-1.5 text-xs bg-white"
                        placeholder="e.g. Satara"
                        value={newFarmerVillage}
                        onChange={e => setNewFarmerVillage(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Assoc Bank</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border rounded-xl px-3 py-1.5 text-xs bg-white font-mono"
                        placeholder="SBI ****221"
                        value={newFarmerBank}
                        onChange={e => setNewFarmerBank(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 h-10 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/95 transition text-xs shadow-sm cursor-pointer"
                  >
                    Enroll Member Details
                  </button>
                </form>
              </div>

              <div className="p-4 border border-dashed border-border bg-white rounded-3xl text-xs space-y-2">
                <h4 className="font-bold text-tile-blue-icon uppercase flex items-center gap-1.5">
                  <CheckCircle className="size-4 shrink-0" />
                  Ledger Sync Status
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  All farmer registrations synchronize with the central state subsidy ledger instantly.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "land" && (
          <div className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in relative">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                <FileCheck className="size-5 text-tile-blue-icon" /> 7/12 Land Registry Auditing
              </h3>
              <p className="text-xs text-muted-foreground">Verify soil type and survey boundaries to unlock eligibility for agricultural credit plans.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="py-2.5">Extract ID</th>
                    <th>Farmer Name</th>
                    <th>Survey Coordinates</th>
                    <th>Acreage Size</th>
                    <th>Soil Composition</th>
                    <th>Verification File</th>
                    <th>Inspection check</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {landExtracts.map((l, i) => (
                    <tr key={i} className="hover:bg-secondary/25 transition">
                      <td className="py-4 font-mono font-medium text-muted-foreground">{l.id}</td>
                      <td className="font-bold text-foreground">{l.farmerName}</td>
                      <td className="font-mono">{l.surveyNo}</td>
                      <td>{l.acreage} Acres</td>
                      <td>{l.soil}</td>
                      <td className="text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer py-4" onClick={() => setInspectingLand(l)}>
                        <FileText className="size-4.5 shrink-0 text-muted-foreground" />
                        {l.file}
                      </td>
                      <td>
                        {l.inspected ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold">
                            <CheckCircle className="size-3" /> Inspected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold">
                            <Clock className="size-3 animate-pulse" /> Awaiting Inspection
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setInspectingLand(l)}
                          className="px-2.5 py-1 bg-secondary text-primary font-bold rounded-lg border border-border/80 hover:bg-accent hover:border-primary/20 transition cursor-pointer"
                        >
                          Audit Document
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Overlay for land records inspections */}
            {inspectingLand && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-scale-up space-y-4">
                  <div className="absolute top-4 right-4">
                    <button onClick={() => setInspectingLand(null)} className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary text-muted-foreground font-black cursor-pointer">×</button>
                  </div>

                  <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                    <FileCheck className="size-6 text-primary" />
                    <div>
                      <h4 className="text-base font-bold text-primary">7/12 Extract Audit workspace</h4>
                      <p className="text-[11px] text-muted-foreground">Document ID: {inspectingLand.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Farmer Beneficiary</span>
                      <span className="font-bold text-foreground">{inspectingLand.farmerName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Survey Registry Code</span>
                      <span className="font-mono font-bold text-foreground">{inspectingLand.surveyNo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Registered Land Acres</span>
                      <span className="font-bold text-foreground">{inspectingLand.acreage} Acres</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Attached Digital Scan</span>
                      <span className="font-bold text-primary flex items-center gap-1"><FileText className="size-3.5" />{inspectingLand.file}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/40 rounded-2xl p-4 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-primary">Lab soil composition analysis</span>
                      <p className="text-muted-foreground mt-0.5 leading-snug">{inspectingLand.soil}</p>
                    </div>
                    <div className="border-t border-border/40 pt-2 mt-1">
                      <span className="font-bold text-primary">Agricultural Crop Suitability score</span>
                      <p className="text-muted-foreground mt-0.5 leading-snug">{inspectingLand.cropSuitability}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-border pt-4 mt-2">
                    <button
                      onClick={() => setInspectingLand(null)}
                      className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-secondary transition cursor-pointer"
                    >
                      Close Extract Inspector
                    </button>
                    {!inspectingLand.inspected && (
                      <button
                        onClick={handleModalApprove}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition shadow-sm cursor-pointer"
                      >
                        Approve & Verify Land Info
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "dbt" && (
          <div className="bg-white border border-border rounded-3xl p-5 shadow-sm space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="flex justify-between items-center flex-wrap gap-3 pb-3 border-b border-border/50">
              <div>
                <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <Landmark className="size-5 text-[oklch(0.35_0.15_255)]" /> Direct Benefit Transfer (DBT) Portal coordination
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">Enroll farmers to state agricultural financial aid schemes. Ensure Aadhaar banking linkage is verified before pushing claims.</p>
              </div>
            </div>

            {/* Scheme quick overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium">
              <div className="p-3 bg-tile-green rounded-2xl flex flex-col justify-between border border-border/10">
                <span className="font-bold text-primary block">PM Kisan Samman Nidhi</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">₹6,000 yearly general farmer income aid</span>
              </div>
              <div className="p-3 bg-tile-blue rounded-2xl flex flex-col justify-between border border-border/10">
                <span className="font-bold text-tile-blue-icon block">PM Fasal Bima Yojana</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">Crop insurance cover against natural hazards</span>
              </div>
              <div className="p-3 bg-tile-violet rounded-2xl flex flex-col justify-between border border-border/10">
                <span className="font-bold text-tile-violet-icon block">Solar Pump Subsidy</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">90% capital subsidy for solar tube-wells</span>
              </div>
              <div className="p-3 bg-tile-amber rounded-2xl flex flex-col justify-between border border-border/10">
                <span className="font-bold text-tile-amber-icon block">Fertilizer Subvention</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">Direct discount on urea/DAP at FPO outlets</span>
              </div>
            </div>

            {/* Farmer linking table */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-primary">FPO member scheme links workspace</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="py-2.5">ID</th>
                      <th>Farmer Name</th>
                      <th>Aadhaar seeded bank card</th>
                      <th>Land acres</th>
                      <th>Active Linked Aid Schemes</th>
                      <th className="text-right">DBT Claim Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {farmers.map((f, i) => (
                      <tr key={i} className="hover:bg-secondary/25 transition">
                        <td className="py-4 font-mono font-medium text-muted-foreground">{f.id}</td>
                        <td className="font-bold text-foreground">{f.name}</td>
                        <td>
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            f.aadhaarSeeded.includes("Verified") ? "text-primary" : "text-amber-700"
                          }`}>
                            {f.aadhaarSeeded}
                            <span className="text-[10px] text-muted-foreground font-normal">({f.bank})</span>
                          </span>
                        </td>
                        <td>{f.land} Acres</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {f.schemes.length > 0 ? (
                              f.schemes.map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-tile-green text-[9px] text-primary font-bold rounded">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-muted-foreground font-semibold">No schemes linked</span>
                            )}
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!f.schemes.includes("PM-Kisan") && (
                              <button
                                disabled={linkingSchemeId !== null}
                                onClick={() => handleLinkScheme(f.id, "PM-Kisan")}
                                className="px-2 py-1 text-[9px] font-bold text-white bg-primary rounded-md disabled:bg-muted font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                {linkingSchemeId === `${f.id}-PM-Kisan` ? <Loader2 className="size-3 animate-spin" /> : "+ PM-Kisan"}
                              </button>
                            )}
                            {!f.schemes.includes("Fasal Bima") && (
                              <button
                                disabled={linkingSchemeId !== null}
                                onClick={() => handleLinkScheme(f.id, "Fasal Bima")}
                                className="px-2 py-1 text-[9px] font-bold text-white bg-tile-blue-icon rounded-md disabled:bg-muted font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                {linkingSchemeId === `${f.id}-Fasal Bima` ? <Loader2 className="size-3 animate-spin" /> : "+ Fasal Bima"}
                              </button>
                            )}
                            {!f.schemes.includes("Solar Pump") && f.land > 5 && (
                              <button
                                disabled={linkingSchemeId !== null}
                                onClick={() => handleLinkScheme(f.id, "Solar Pump")}
                                className="px-2 py-1 text-[9px] font-bold text-white bg-tile-violet-icon rounded-md disabled:bg-muted font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                {linkingSchemeId === `${f.id}-Solar Pump` ? <Loader2 className="size-3 animate-spin text-white" /> : "+ Solar Pump"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
