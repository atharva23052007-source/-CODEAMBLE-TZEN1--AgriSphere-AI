export type ListingStatus = "Available" | "Booked" | "Delivered";
export type ContractStatus = "Escrow Locked" | "Seller Accepts" | "Dispatched" | "In Transit" | "Delivered & Settled";
export type LedgerStatus = "LOCKED" | "RELEASED" | "SETTLED";

export interface Listing {
  id: string;
  crop: string;
  fpo: string;
  qty: string;
  price: string;
  cert: string;
  status: ListingStatus;
  sellerId: string;
  location: string;
}

export interface Contract {
  id: string;
  listingId: string;
  crop: string;
  qty: string;
  amount: number;
  status: ContractStatus;
  origin: string;
  dest: string;
  date: string;
  buyerId: string;
  sellerId: string;
}

export interface LedgerEntry {
  txHash: string;
  type: string;
  crop: string;
  fpo: string;
  amount: number;
  date: string;
  status: LedgerStatus;
  userId: string;
}

const STORAGE_KEY = "agrisphere_trader_db";

export function parseAmount(qtyStr: string, priceStr: string): number {
  if (!qtyStr || !priceStr) return 0;
  
  const qtyMatch = qtyStr.match(/([\d.,]+)/);
  const numericQty = qtyMatch ? parseFloat(qtyMatch[1].replace(/,/g, "")) : 0;

  const priceMatch = priceStr.match(/([\d.,]+)/);
  const numericPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, "")) : 0;

  if (isNaN(numericQty) || isNaN(numericPrice) || numericQty <= 0 || numericPrice <= 0) {
    return 0;
  }

  const priceLower = priceStr.toLowerCase();
  const qtyLower = qtyStr.toLowerCase();

  // Price is per Quintal (1 Quintal = 100 kg)
  if (priceLower.includes("quintal") || priceLower.includes("qtl")) {
    if (qtyLower.includes("ton") || qtyLower.includes("mt")) {
      // 1 Ton = 10 Quintals
      return Math.round(numericQty * 10 * numericPrice);
    }
    return Math.round(numericQty * numericPrice);
  }

  // Price is per Ton
  if (priceLower.includes("ton") || priceLower.includes("mt")) {
    if (qtyLower.includes("quintal") || qtyLower.includes("qtl")) {
      // 10 Quintals = 1 Ton
      return Math.round((numericQty / 10) * numericPrice);
    }
    return Math.round(numericQty * numericPrice);
  }

  // Price is per Kg
  if (priceLower.includes("kg")) {
    if (qtyLower.includes("ton") || qtyLower.includes("mt")) {
      return Math.round(numericQty * 1000 * numericPrice);
    }
    if (qtyLower.includes("quintal") || qtyLower.includes("qtl")) {
      return Math.round(numericQty * 100 * numericPrice);
    }
    return Math.round(numericQty * numericPrice);
  }

  return Math.round(numericQty * numericPrice);
}

interface DBState {
  listings: Listing[];
  contracts: Contract[];
  ledgers: LedgerEntry[];
  balances: Record<string, number>;
}

const defaultState: DBState = {
  listings: [
    { id: "L-956", crop: "Wheat", fpo: "Satara Farmers Coop", qty: "50 Tons", price: "₹1,200 / Ton", cert: "Quality Grade-A A+ Passed", status: "Booked", sellerId: "seller_1", location: "Satara Hub" },
    { id: "L-980", crop: "Rice", fpo: "Satara Farmers Coop", qty: "50 Tons", price: "₹1,200 / Ton", cert: "ISO 22000 Food Safety", status: "Booked", sellerId: "seller_1", location: "Koregaon Hub" },
    { id: "L-901", crop: "Soybean", fpo: "Satara Farmers Coop", qty: "45 Tons", price: "₹4,890 / Ton", cert: "Quality Grade-A A+ Passed", status: "Available", sellerId: "seller_1", location: "Satara Hub" },
    { id: "L-902", crop: "Sugarcane", fpo: "Koregaon FPO", qty: "110 Tons", price: "₹3,150 / Ton", cert: "Organic Certified NPOP", status: "Available", sellerId: "seller_1", location: "Koregaon Hub" },
    { id: "L-904", crop: "Wheat (Sharbati)", fpo: "Satara Farmers Coop", qty: "60 Tons", price: "₹2,600 / Ton", cert: "Grain Moisture 11% OK", status: "Available", sellerId: "seller_1", location: "Satara Hub" },
  ],
  contracts: [
    {
      id: "TX-449",
      listingId: "L-956",
      crop: "Wheat",
      qty: "50 Tons",
      amount: 60000,
      status: "Seller Accepts",
      origin: "Satara Hub",
      dest: "Mumbai Port Warehouse",
      date: "2026-08-01",
      buyerId: "trader_1",
      sellerId: "seller_1"
    },
    {
      id: "TX-750",
      listingId: "L-980",
      crop: "Rice",
      qty: "50 Tons",
      amount: 60000,
      status: "Escrow Locked",
      origin: "Koregaon Hub",
      dest: "Pune Central Silo",
      date: "2026-08-05",
      buyerId: "trader_1",
      sellerId: "seller_1"
    }
  ],
  ledgers: [
    { txHash: "ESC-449-MH", type: "Lock Protection", crop: "Wheat", fpo: "Satara Farmers Coop", amount: 60000, date: "2026-08-01", status: "LOCKED", userId: "trader_1" },
    { txHash: "ESC-750-MH", type: "Lock Protection", crop: "Rice", fpo: "Satara Farmers Coop", amount: 60000, date: "2026-08-05", status: "LOCKED", userId: "trader_1" },
    { txHash: "DEP-102-MH", type: "Wallet Deposit", crop: "N/A", fpo: "General Deposit Bank", amount: 500000, date: "2026-07-09", status: "SETTLED", userId: "trader_1" },
  ],
  balances: {
    trader_1: 380000,
    seller_1: 0,
  }
};

class MockTraderDB {
  private state: DBState;

  constructor() {
    let saved = null;
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      saved = localStorage.getItem(STORAGE_KEY);
    }
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        if (!this.state.listings || !this.state.balances || !this.state.balances["trader_1"]) {
          this.state = defaultState;
        }
      } catch (e) {
        this.state = defaultState;
      }
    } else {
      this.state = defaultState;
      this.save();
    }
  }

  private save() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      window.dispatchEvent(new Event("trader-db-updated"));
    }
  }

  getState() {
    return this.state;
  }

  // Balances
  deposit(userId: string, amount: number) {
    this.state.balances[userId] = (this.state.balances[userId] || 0) + amount;
    
    const newEntry: LedgerEntry = {
      txHash: `DEP-${Math.floor(100 + Math.random() * 899)}-MH`,
      type: "Wallet Deposit",
      crop: "N/A",
      fpo: "General Deposit Bank",
      amount,
      date: new Date().toISOString().substring(0, 10),
      status: "SETTLED",
      userId,
    };
    this.state.ledgers.unshift(newEntry);
    this.save();
  }

  // Listings
  addListing(listing: Omit<Listing, "id" | "status">) {
    const newListing: Listing = {
      ...listing,
      id: `L-${Math.floor(900 + Math.random() * 99)}`,
      status: "Available"
    };
    this.state.listings.unshift(newListing);
    this.save();
    return newListing;
  }

  // Trader Action: Buy Listing
  buyListing(listingId: string, traderId: string) {
    const listing = this.state.listings.find(l => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    if (listing.status !== "Available") throw new Error("Listing is no longer available.");

    const calculatedAmount = parseAmount(listing.qty, listing.price);
    if (calculatedAmount <= 0) {
      throw new Error("Invalid quantity or price specified on harvest listing.");
    }

    const availableBalance = this.state.balances[traderId] || 0;
    if (availableBalance < calculatedAmount) {
      throw new Error(`Insufficient funds in General Trading Wallet. Available: ₹${availableBalance.toLocaleString()}, Required: ₹${calculatedAmount.toLocaleString()}. Please deposit funds to complete escrow.`);
    }

    // Deduct funds from trading wallet
    this.state.balances[traderId] -= calculatedAmount;
    
    // Update listing status
    listing.status = "Booked";

    // Create Contract
    const newContract: Contract = {
      id: `TX-${Math.floor(400 + Math.random() * 599)}`,
      listingId: listing.id,
      crop: listing.crop,
      qty: listing.qty,
      amount: calculatedAmount,
      status: "Escrow Locked",
      origin: listing.location || "Central Hub",
      dest: "Mumbai Port Warehouse",
      date: new Date().toISOString().substring(0, 10),
      buyerId: traderId,
      sellerId: listing.sellerId,
    };
    this.state.contracts.unshift(newContract);

    // Create Ledger (LOCKED)
    const newLedger: LedgerEntry = {
      txHash: `ESC-${Math.floor(400 + Math.random() * 599)}-MH`,
      type: "Lock Protection",
      crop: listing.crop,
      fpo: listing.fpo,
      amount: calculatedAmount,
      date: new Date().toISOString().substring(0, 10),
      status: "LOCKED",
      userId: traderId,
    };
    this.state.ledgers.unshift(newLedger);

    this.save();
  }

  // Seller Actions
  acceptContract(contractId: string, sellerId: string) {
    const contract = this.state.contracts.find(c => c.id === contractId && c.sellerId === sellerId);
    if (contract && contract.status === "Escrow Locked") {
      contract.status = "Seller Accepts";
      this.save();
    }
  }

  updateShipment(contractId: string, sellerId: string, newStatus: ContractStatus) {
    const contract = this.state.contracts.find(c => c.id === contractId && c.sellerId === sellerId);
    if (contract) {
      contract.status = newStatus;
      this.save();
    }
  }

  // Trader Action: Release Escrow (Delivered)
  releaseEscrow(contractId: string, traderId: string) {
    const contract = this.state.contracts.find(c => c.id === contractId && c.buyerId === traderId);
    if (!contract || contract.status === "Delivered & Settled") return;

    contract.status = "Delivered & Settled";

    // Release ledger
    const ledger = this.state.ledgers.find(l => l.crop === contract.crop && l.amount === contract.amount && l.status === "LOCKED");
    if (ledger) {
      ledger.status = "RELEASED";
    }

    // Add to seller's balance
    this.state.balances[contract.sellerId] = (this.state.balances[contract.sellerId] || 0) + contract.amount;
    
    // Add settlement ledger for seller
    const sellerLedger: LedgerEntry = {
      txHash: `SET-${Math.floor(100 + Math.random() * 899)}-MH`,
      type: "Payout Settled",
      crop: contract.crop,
      fpo: "Self",
      amount: contract.amount,
      date: new Date().toISOString().substring(0, 10),
      status: "SETTLED",
      userId: contract.sellerId,
    };
    this.state.ledgers.unshift(sellerLedger);

    // Mark listing as delivered
    const listing = this.state.listings.find(l => l.id === contract.listingId);
    if (listing) {
      listing.status = "Delivered";
    }

    this.save();
  }
}

export const traderDB = new MockTraderDB();
