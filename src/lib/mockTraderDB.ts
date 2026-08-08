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

interface DBState {
  listings: Listing[];
  contracts: Contract[];
  ledgers: LedgerEntry[];
  balances: Record<string, number>;
}

const defaultState: DBState = {
  listings: [
    { id: "L-901", crop: "Soybean", fpo: "Satara Farmers Coop", qty: "45 Tons", price: "₹4,890 / Quintal", cert: "Quality Grade-A A+ Passed", status: "Available", sellerId: "seller_1", location: "Satara Hub" },
    { id: "L-902", crop: "Sugarcane", fpo: "Koregaon FPO", qty: "110 Tons", price: "₹3,150 / Quintal", cert: "Organic Certified NPOP", status: "Available", sellerId: "seller_1", location: "Koregaon Hub" },
    { id: "L-904", crop: "Wheat (Sharbati)", fpo: "Satara Farmers Coop", qty: "60 Tons", price: "₹2,600 / Quintal", cert: "Grain Moisture 11% OK", status: "Available", sellerId: "seller_1", location: "Satara Hub" },
  ],
  contracts: [],
  ledgers: [
    { txHash: "DEP-102-MH", type: "Wallet Deposit", crop: "N/A", fpo: "General Deposit", amount: 200000, date: "2026-07-09", status: "SETTLED", userId: "trader_1" },
  ],
  balances: {
    trader_1: 500000,
    seller_1: 0,
  }
};

class MockTraderDB {
  private state: DBState;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.state = defaultState;
      }
    } else {
      this.state = defaultState;
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    window.dispatchEvent(new Event("trader-db-updated"));
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

    const numericPrice = parseInt(listing.price.replace(/\D/g, ""));
    const calculatedAmount = Math.floor(numericPrice * 10 * 0.8); // 80% mock logic from buyer.tsx

    if ((this.state.balances[traderId] || 0) < calculatedAmount) {
      throw new Error("Insufficient funds");
    }

    // Deduct funds
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
      origin: listing.location,
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
