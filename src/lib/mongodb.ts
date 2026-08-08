// Server-only database layer for AgriSphere Trader/Seller workflow.
// Connects to MongoDB Atlas using process.env.MONGODB_URI.
// Uses Google DNS (8.8.8.8) to resolve SRV records on Windows.
// Provides automatic persistent fallback if Atlas SSL/IP whitelist blocks connection.

import { MongoClient, type Db } from "mongodb";
import dns from "dns";
import fs from "fs";
import path from "path";
import type { Listing, Contract, LedgerEntry, ContractStatus } from "./mockTraderDB";

// Fix Node.js SRV resolution on Windows by specifying DNS servers
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignored if custom DNS cannot be set
}

const DB_NAME = "agrisphere";
let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isAtlasConnected = false;
let lastAtlasCheck = 0;
const ATLAS_RETRY_INTERVAL = 60000; // Retry Atlas every 60s if initial connection fails

// Local persistent file fallback path
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "trader_db.json");

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

function loadFileState(): DBState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read local file store:", err);
  }
  saveFileState(defaultState);
  return defaultState;
}

function saveFileState(state: DBState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write local file store:", err);
  }
}

export async function getDB(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (dbInstance && isAtlasConnected) {
    return dbInstance;
  }

  const now = Date.now();
  if (!isAtlasConnected && lastAtlasCheck > 0 && now - lastAtlasCheck < ATLAS_RETRY_INTERVAL) {
    return null;
  }
  lastAtlasCheck = now;

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    await client.connect();
    dbInstance = client.db(DB_NAME);
    isAtlasConnected = true;
    console.log("🟢 Connected successfully to MongoDB Atlas database:", DB_NAME);
    return dbInstance;
  } catch (err: any) {
    isAtlasConnected = false;
    client = null;
    dbInstance = null;
    console.warn("⚠️ MongoDB Atlas connection notice:", err.message || err);
    console.log("📁 Operating with persistent server storage (.data/trader_db.json)");
    return null;
  }
}

// Unified Store Methods

function strip_id<T extends Record<string, unknown>>(doc: T): T {
  const { _id, ...rest } = doc as Record<string, unknown>;
  void _id;
  return rest as T;
}

export async function storeGetState(): Promise<DBState> {
  const db = await getDB();
  if (db) {
    try {
      const count = await db.collection("listings").countDocuments();
      if (count === 0) {
        await db.collection("listings").insertMany(defaultState.listings);
        await db.collection("ledgers").insertMany(defaultState.ledgers);
        for (const [userId, balance] of Object.entries(defaultState.balances)) {
          await db.collection("balances").updateOne({ userId }, { $set: { userId, balance } }, { upsert: true });
        }
      }

      const [listings, contracts, ledgers, balanceDocs] = await Promise.all([
        db.collection<Listing>("listings").find().toArray(),
        db.collection<Contract>("contracts").find().toArray(),
        db.collection<LedgerEntry>("ledgers").find().toArray(),
        db.collection<{ userId: string; balance: number }>("balances").find().toArray(),
      ]);

      const balances: Record<string, number> = {};
      for (const b of balanceDocs) balances[b.userId] = b.balance;

      return {
        listings: listings.map(strip_id),
        contracts: contracts.map(strip_id),
        ledgers: ledgers.map(strip_id),
        balances,
      };
    } catch (e) {
      console.warn("MongoDB read failed, using local persistent store:", e);
    }
  }

  return loadFileState();
}

export async function storeDeposit(userId: string, amount: number) {
  const db = await getDB();
  const date = new Date().toISOString().substring(0, 10);
  const txHash = `DEP-${Math.floor(100 + Math.random() * 899)}-MH`;

  if (db) {
    try {
      await db.collection("balances").updateOne({ userId }, { $inc: { balance: amount } }, { upsert: true });
      await db.collection("ledgers").insertOne({
        txHash,
        type: "Wallet Deposit",
        crop: "N/A",
        fpo: "General Deposit Bank",
        amount,
        date,
        status: "SETTLED",
        userId,
      });
      return;
    } catch (e) {
      console.warn("MongoDB deposit failed, falling back to local file store:", e);
    }
  }

  const state = loadFileState();
  state.balances[userId] = (state.balances[userId] || 0) + amount;
  state.ledgers.unshift({
    txHash,
    type: "Wallet Deposit",
    crop: "N/A",
    fpo: "General Deposit Bank",
    amount,
    date,
    status: "SETTLED",
    userId,
  });
  saveFileState(state);
}

export async function storeAddListing(data: Omit<Listing, "id" | "status">): Promise<Listing> {
  const stateNow = await storeGetState();
  
  // Deduplication check: prevent duplicate listing if identical details submitted
  const existingDup = stateNow.listings.find(
    (l) => l.crop === data.crop && l.qty === data.qty && l.price === data.price && l.sellerId === data.sellerId && l.location === data.location
  );
  if (existingDup) {
    return existingDup;
  }

  const newListing: Listing = {
    ...data,
    id: `L-${Math.floor(900 + Math.random() * 99)}`,
    status: "Available",
  };

  const db = await getDB();
  if (db) {
    try {
      await db.collection("listings").insertOne({ ...newListing });
      return newListing;
    } catch (e) {
      console.warn("MongoDB addListing failed, falling back to local file store:", e);
    }
  }

  const state = loadFileState();
  state.listings.unshift(newListing);
  saveFileState(state);
  return newListing;
}

export async function storeBuyListing(listingId: string, traderId: string) {
  const stateNow = await storeGetState();
  const listing = stateNow.listings.find((l) => l.id === listingId);
  if (!listing) throw new Error("Listing not found");

  // Protection: ensure listing is available and not already booked/contracted
  if (listing.status !== "Available") {
    throw new Error("This produce listing has already been booked!");
  }

  const existingContract = stateNow.contracts.find((c) => c.listingId === listingId);
  if (existingContract) {
    throw new Error("A procurement contract already exists for this listing!");
  }

  const numericPrice = parseInt(listing.price.replace(/\D/g, ""));
  const calculatedAmount = Math.floor(numericPrice * 10 * 0.8);

  const currentBal = stateNow.balances[traderId] || 0;
  if (currentBal < calculatedAmount) {
    throw new Error("Insufficient funds in general deposit vault!");
  }

  const date = new Date().toISOString().substring(0, 10);
  const contractId = `TX-${Math.floor(400 + Math.random() * 599)}`;
  const txHash = `ESC-${Math.floor(400 + Math.random() * 599)}-MH`;

  const newContract: Contract = {
    id: contractId,
    listingId: listing.id,
    crop: listing.crop,
    qty: listing.qty,
    amount: calculatedAmount,
    status: "Escrow Locked",
    origin: listing.location || "Central Hub",
    dest: "Mumbai Port Warehouse",
    date,
    buyerId: traderId,
    sellerId: listing.sellerId,
  };

  const newLedger: LedgerEntry = {
    txHash,
    type: "Lock Protection",
    crop: listing.crop,
    fpo: listing.fpo,
    amount: calculatedAmount,
    date,
    status: "LOCKED",
    userId: traderId,
  };

  const db = await getDB();
  if (db) {
    try {
      await db.collection("balances").updateOne({ userId: traderId }, { $inc: { balance: -calculatedAmount } });
      await db.collection("listings").updateOne({ id: listingId }, { $set: { status: "Booked" } });
      await db.collection("contracts").insertOne({ ...newContract });
      await db.collection("ledgers").insertOne({ ...newLedger });
      return;
    } catch (e) {
      console.warn("MongoDB buyListing failed, falling back to local file store:", e);
    }
  }

  const state = loadFileState();
  state.balances[traderId] = (state.balances[traderId] || 0) - calculatedAmount;
  const lIdx = state.listings.findIndex((l) => l.id === listingId);
  if (lIdx !== -1) state.listings[lIdx].status = "Booked";
  state.contracts.unshift(newContract);
  state.ledgers.unshift(newLedger);
  saveFileState(state);
}

export async function storeAcceptContract(contractId: string, sellerId: string) {
  const stateNow = await storeGetState();
  const contract = stateNow.contracts.find((c) => c.id === contractId && c.sellerId === sellerId);
  if (!contract || contract.status !== "Escrow Locked") {
    return; // Already accepted or invalid status, avoid duplicate action
  }

  const db = await getDB();
  if (db) {
    try {
      await db.collection("contracts").updateOne(
        { id: contractId, sellerId, status: "Escrow Locked" },
        { $set: { status: "Seller Accepts" } }
      );
      return;
    } catch (e) {
      console.warn("MongoDB acceptContract failed, falling back to local file store:", e);
    }
  }

  const state = loadFileState();
  const c = state.contracts.find((c) => c.id === contractId && c.sellerId === sellerId);
  if (c && c.status === "Escrow Locked") {
    c.status = "Seller Accepts";
    saveFileState(state);
  }
}

export async function storeUpdateShipment(contractId: string, sellerId: string, newStatus: ContractStatus) {
  const db = await getDB();
  if (db) {
    try {
      await db.collection("contracts").updateOne(
        { id: contractId, sellerId },
        { $set: { status: newStatus } }
      );
      return;
    } catch (e) {
      console.warn("MongoDB updateShipment failed, falling back to local file store:", e);
    }
  }

  const state = loadFileState();
  const c = state.contracts.find((contract) => contract.id === contractId && contract.sellerId === sellerId);
  if (c) {
    c.status = newStatus;
    saveFileState(state);
  }
}

export async function storeReleaseEscrow(contractId: string, traderId: string) {
  const stateNow = await storeGetState();
  const contract = stateNow.contracts.find((c) => c.id === contractId && c.buyerId === traderId);
  if (!contract || contract.status === "Delivered & Settled") return;

  const date = new Date().toISOString().substring(0, 10);
  const sellerLedger: LedgerEntry = {
    txHash: `SET-${Math.floor(100 + Math.random() * 899)}-MH`,
    type: "Payout Settled",
    crop: contract.crop,
    fpo: "Self",
    amount: contract.amount,
    date,
    status: "SETTLED",
    userId: contract.sellerId,
  };

  const db = await getDB();
  if (db) {
    try {
      await db.collection("contracts").updateOne({ id: contractId }, { $set: { status: "Delivered & Settled" } });
      await db.collection("ledgers").updateOne(
        { crop: contract.crop, amount: contract.amount, status: "LOCKED", userId: traderId },
        { $set: { status: "RELEASED" } }
      );
      await db.collection("balances").updateOne(
        { userId: contract.sellerId },
        { $inc: { balance: contract.amount } },
        { upsert: true }
      );
      await db.collection("ledgers").insertOne({ ...sellerLedger });
      await db.collection("listings").updateOne({ id: contract.listingId }, { $set: { status: "Delivered" } });
      return;
    } catch (e) {
      console.warn("MongoDB releaseEscrow failed, falling back to local file store:", e);
    }
  }

  const state = loadFileState();
  const c = state.contracts.find((x) => x.id === contractId);
  if (c) c.status = "Delivered & Settled";

  const l = state.ledgers.find((x) => x.crop === contract.crop && x.amount === contract.amount && x.status === "LOCKED");
  if (l) l.status = "RELEASED";

  state.balances[contract.sellerId] = (state.balances[contract.sellerId] || 0) + contract.amount;
  state.ledgers.unshift(sellerLedger);

  const listing = state.listings.find((x) => x.id === contract.listingId);
  if (listing) listing.status = "Delivered";

  saveFileState(state);
}
