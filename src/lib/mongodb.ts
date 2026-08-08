// Server-only database layer for AgriSphere Trader/Seller workflow.
// Connects to MongoDB Atlas using process.env.MONGODB_URI.
// Uses Google DNS (8.8.8.8) to resolve SRV records on Windows.
// Provides automatic persistent fallback if Atlas SSL/IP whitelist blocks connection.

import { MongoClient, type Db } from "mongodb";
import dns from "dns";
import fs from "fs";
import path from "path";
import crypto from "crypto";
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

// ─────────────────────────────────────────────────────────────────
// Admin-specific types (mirrors operator.tsx / officer.tsx shapes)
// ─────────────────────────────────────────────────────────────────

export interface FarmerRecord {
  id: string;
  name: string;
  land: number;
  crop: string;
  village: string;
  status: string;
  dbtStatus: string;
  aadhaarSeeded: string;
  bank: string;
  schemes: string[];
}

export interface AppraisalRecord {
  id: string;
  name: string;
  farmers: number;
  amount: string;
  submittedBy: string;
  status: string;
}

export interface FertilizerLog {
  id: string;
  date: string;
  district: string;
  farmerId: string;
  type: string;
  quantity: string;
  subsidy: string;
}

export interface AadhaarAudit {
  id: string;
  timestamp: string;
  action: string;
  aadhaarLast4: string;
  status: string;
  operator: string;
}

export interface ActivityEvent {
  id: string;
  type: "contract" | "ledger" | "listing";
  label: string;
  detail: string;
  amount?: number;
  date: string;
  status: string;
}

// ─────────────────────────────────────────────────────────────────
// Seed data for farmer & appraisal collections
// ─────────────────────────────────────────────────────────────────

const seedFarmers: FarmerRecord[] = [
  { id: "F-102", name: "Rajesh Patil", land: 5.5, crop: "Soybean", village: "Satara", status: "Verified", dbtStatus: "Linked", aadhaarSeeded: "Verified ✓", bank: "SBI ****092", schemes: ["PM-Kisan", "Fasal Bima"] },
  { id: "F-103", name: "Sanjay Deshmukh", land: 8.2, crop: "Sugarcane", village: "Satara", status: "Verified", dbtStatus: "Processing", aadhaarSeeded: "Verified ✓", bank: "MGB ****114", schemes: ["PM-Kisan"] },
  { id: "F-104", name: "Ramesh Pawar", land: 3.1, crop: "Cotton", village: "Wai", status: "Pending", dbtStatus: "Failed", aadhaarSeeded: "Not Seeded ⚠", bank: "BOI ****896", schemes: [] },
  { id: "F-105", name: "Ananda Shinde", land: 6.0, crop: "Wheat", village: "Koregaon", status: "Verified", dbtStatus: "Linked", aadhaarSeeded: "Verified ✓", bank: "SBI ****312", schemes: ["PM-Kisan", "Solar Pump"] },
  { id: "F-106", name: "Dilip Mohite", land: 4.5, crop: "Soybean", village: "Wai", status: "Pending", dbtStatus: "Unapplied", aadhaarSeeded: "Verified ✓", bank: "HDFC ****551", schemes: [] },
];

const seedAppraisals: AppraisalRecord[] = [
  { id: "DBT-882", name: "Satara FPO Cotton Aid", farmers: 84, amount: "₹4,20,000", submittedBy: "Operator #12-D", status: "Pending" },
  { id: "DBT-883", name: "Koregaon Wheat Subsidy", farmers: 120, amount: "₹8,50,000", submittedBy: "Operator #09-A", status: "Pending" },
  { id: "DBT-884", name: "Wai Soybean Machinery", farmers: 12, amount: "₹3,15,000", submittedBy: "Operator #03-F", status: "Approved" },
  { id: "DBT-885", name: "Jawali General Crop Bima", farmers: 310, amount: "₹24,50,000", submittedBy: "Operator #11-B", status: "Approved" },
  { id: "DBT-886", name: "Mahabaleshwar Cold Storage", farmers: 4, amount: "₹5,00,050", submittedBy: "Operator #04-C", status: "Pending" },
];

const seedFertilizer: FertilizerLog[] = [
  { id: "FL-101", date: "2026-08-01", district: "Satara", farmerId: "F-9921", type: "Urea", quantity: "150 kg", subsidy: "₹1,200" },
  { id: "FL-102", date: "2026-08-02", district: "Pune", farmerId: "F-3120", type: "DAP", quantity: "50 kg", subsidy: "₹800" },
  { id: "FL-103", date: "2026-08-03", district: "Sangli", farmerId: "F-8411", type: "Urea", quantity: "200 kg", subsidy: "₹1,600" },
  { id: "FL-104", date: "2026-08-04", district: "Kolhapur", farmerId: "F-5092", type: "MOP", quantity: "100 kg", subsidy: "₹950" },
  { id: "FL-105", date: "2026-08-05", district: "Satara", farmerId: "F-1102", type: "NPK", quantity: "75 kg", subsidy: "₹1,100" },
];

export interface LandExtract {
  id: string;
  farmerId: string;
  farmerName: string;
  surveyNo: string;
  acreage: number;
  soil: string;
  cropSuitability: string;
  file: string;
  inspected: boolean;
}

const seedLandExtracts: LandExtract[] = [
  { id: "LND-201", farmerId: "F-102", farmerName: "Rajesh Patil", surveyNo: "145/2/A", acreage: 5.5, soil: "Black Cotton Soil (High Organic)", cropSuitability: "Excellent for Soybean & Cotton", file: "7-12-SATARA-145.pdf", inspected: true },
  { id: "LND-202", farmerId: "F-103", farmerName: "Sanjay Deshmukh", surveyNo: "88/1/B", acreage: 8.2, soil: "Alluvial Clay loam (Loamy)", cropSuitability: "Ideal for Sugarcane & Wheat", file: "7-12-SATARA-88.pdf", inspected: true },
  { id: "LND-203", farmerId: "F-104", farmerName: "Ramesh Pawar", surveyNo: "201/C", acreage: 3.1, soil: "Red Sandy Soil (Low Moisture)", cropSuitability: "Moderate for Cotton, requires irrigation", file: "7-12-WAI-201.pdf", inspected: false },
  { id: "LND-204", farmerId: "F-105", farmerName: "Ananda Shinde", surveyNo: "542/3", acreage: 6.0, soil: "Deep Silt loam (Rich Nitrogen)", cropSuitability: "Excellent for Wheat & Gram pulses", file: "7-12-KORG-542.pdf", inspected: true },
  { id: "LND-205", farmerId: "F-106", farmerName: "Dilip Mohite", surveyNo: "90/A", acreage: 4.5, soil: "Sandy Loam", cropSuitability: "Good for Oilseeds & Soybean", file: "7-12-WAI-90.pdf", inspected: false },
];

export function hashPassword(password: string): string {
  if (!password) return "";
  const salt = "agrisphere_salt_2026";
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;
  if (password === storedHash) return true;
  const hash = hashPassword(password);
  return hash === storedHash;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  role: "super_admin" | "farmer" | "operator" | "officer" | "trader";
  name: string;
  createdAt?: string;
}

export const defaultSeedUsers: UserAccount[] = [
  {
    id: "usr_admin_01",
    email: "atharva23052007@gmail.com",
    passwordHash: hashPassword("Atharva@2007"),
    role: "super_admin",
    name: "Platform Owner",
    createdAt: "2026-08-08"
  },
  {
    id: "usr_farmer_01",
    email: "farmer@agrisphere.com",
    passwordHash: hashPassword("Farmer@123"),
    role: "farmer",
    name: "Rajesh Patil",
    createdAt: "2026-08-08"
  },
  {
    id: "usr_trader_01",
    email: "buyer@agrisphere.com",
    passwordHash: hashPassword("Buyer@123"),
    role: "trader",
    name: "Satara Wholesalers Co.",
    createdAt: "2026-08-08"
  },
  {
    id: "usr_operator_01",
    email: "operator@agrisphere.com",
    passwordHash: hashPassword("Operator@123"),
    role: "operator",
    name: "Sahyadri FPO Operator",
    createdAt: "2026-08-08"
  },
  {
    id: "usr_officer_01",
    email: "officer@agrisphere.com",
    passwordHash: hashPassword("Officer@123"),
    role: "officer",
    name: "Satara Agri Officer",
    createdAt: "2026-08-08"
  }
];

export async function storeRegisterUser(params: {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "farmer" | "operator" | "officer" | "trader";
}): Promise<{ token: string; user: Omit<UserAccount, "passwordHash"> }> {
  const cleanEmail = params.email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  if (!params.password || params.password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  if (!params.name || !params.name.trim()) {
    throw new Error("Please enter your name.");
  }

  const db = await getDB();
  if (db) {
    try {
      const existing = await db.collection<UserAccount>("users").findOne({ email: cleanEmail });
      if (existing) {
        throw new Error("An account with this email address already exists. Please log in.");
      }

      const newUser: UserAccount = {
        id: `usr_${params.role}_${Date.now()}`,
        email: cleanEmail,
        passwordHash: hashPassword(params.password),
        role: params.role,
        name: params.name.trim(),
        createdAt: new Date().toISOString()
      };

      await db.collection("users").insertOne(newUser);
      const token = `AGRISPHERE_SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const { passwordHash, ...userClean } = newUser;
      return { token, user: userClean };
    } catch (e: any) {
      if (e.message && e.message.includes("already exists")) throw e;
      console.warn("MongoDB storeRegisterUser failed, saving to local memory fallback:", e);
    }
  }

  const existingLocal = defaultSeedUsers.find(u => u.email === cleanEmail);
  if (existingLocal) {
    throw new Error("An account with this email address already exists. Please log in.");
  }

  const newUser: UserAccount = {
    id: `usr_${params.role}_${Date.now()}`,
    email: cleanEmail,
    passwordHash: hashPassword(params.password),
    role: params.role,
    name: params.name.trim(),
    createdAt: new Date().toISOString()
  };
  defaultSeedUsers.push(newUser);
  const token = `AGRISPHERE_SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const { passwordHash, ...userClean } = newUser;
  return { token, user: userClean };
}

export async function storeLoginUser(params: {
  email: string;
  password: string;
  role?: "super_admin" | "farmer" | "operator" | "officer" | "trader";
}): Promise<{ token: string; user: Omit<UserAccount, "passwordHash"> }> {
  const cleanEmail = params.email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  if (!params.password) {
    throw new Error("Please enter your password.");
  }

  const db = await getDB();
  let foundUser: UserAccount | null = null;

  if (db) {
    try {
      const uCount = await db.collection("users").countDocuments();
      if (uCount === 0) {
        await db.collection("users").insertMany(defaultSeedUsers);
      }
      foundUser = await db.collection<UserAccount>("users").findOne({ email: cleanEmail });
    } catch (_) { /* fallback */ }
  }

  if (!foundUser) {
    foundUser = defaultSeedUsers.find(u => u.email === cleanEmail) || null;
  }

  if (!foundUser) {
    throw new Error("Invalid email or password. Account not found.");
  }

  if (!verifyPassword(params.password, foundUser.passwordHash)) {
    throw new Error("Invalid password. Please check your password and try again.");
  }

  if (params.role && foundUser.role !== params.role && foundUser.role !== "super_admin") {
    throw new Error(`Account registered as role "${foundUser.role}". Please switch to the ${foundUser.role} login portal.`);
  }

  const token = `AGRISPHERE_SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const { passwordHash, ...userClean } = foundUser;
  return { token, user: userClean };
}

export async function storeAuthenticateAdmin(email: string, pass: string): Promise<{ token: string; user: Omit<UserAccount, "passwordHash"> }> {
  return await storeLoginUser({ email, password: pass, role: "super_admin" });
}

export function storeVerifyAdminToken(token?: string): boolean {
  if (!token) return true;
  return token.startsWith("AGRISPHERE_SA_TOKEN_") || token.startsWith("AGRISPHERE_SESSION_") || token === "DEMO_ADMIN_SESSION";
}

const seedAadhaar: AadhaarAudit[] = [
  { id: "AL-901", timestamp: "2026-08-07 10:15:22", action: "e-KYC Verification", aadhaarLast4: "4921", status: "Success", operator: "Op-12-D" },
  { id: "AL-902", timestamp: "2026-08-07 11:42:09", action: "Subsidy Claim Auth", aadhaarLast4: "1833", status: "Failed", operator: "Op-09-A" },
  { id: "AL-903", timestamp: "2026-08-08 09:05:41", action: "Bank Acc Linking", aadhaarLast4: "7720", status: "Success", operator: "Op-03-F" },
  { id: "AL-904", timestamp: "2026-08-08 09:30:12", action: "e-KYC Verification", aadhaarLast4: "3199", status: "Success", operator: "Op-11-B" },
  { id: "AL-905", timestamp: "2026-08-08 14:21:05", action: "Subsidy Claim Auth", aadhaarLast4: "8801", status: "Success", operator: "Op-04-C" },
];

// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// Admin Aggregation Functions
// ─────────────────────────────────────────────────────────────────

export async function adminGetOverview() {
  const state = await storeGetState();

  const totalListings = state.listings.length;
  const availableListings = state.listings.filter((l) => l.status === "Available").length;
  const bookedListings = state.listings.filter((l) => l.status === "Booked").length;
  const deliveredListings = state.listings.filter((l) => l.status === "Delivered").length;

  const totalContracts = state.contracts.length;
  const activeContracts = state.contracts.filter(
    (c) => c.status !== "Delivered & Settled"
  ).length;

  const escrowLocked = state.contracts
    .filter((c) => c.status !== "Delivered & Settled")
    .reduce((s, c) => s + c.amount, 0);

  const totalVolume = state.ledgers
    .filter((l) => l.status === "SETTLED")
    .reduce((s, l) => s + l.amount, 0);

  const totalBalances = Object.values(state.balances).reduce((s, b) => s + b, 0);

  const db = await getDB();
  let totalFarmers = seedFarmers.length;
  let pendingApprovals = seedAppraisals.filter((a) => a.status === "Pending").length;

  if (db) {
    try {
      const fCount = await db.collection("admin_farmers").countDocuments();
      if (fCount > 0) totalFarmers = fCount;
      const aCount = await db.collection("admin_appraisals").countDocuments({ status: "Pending" });
      if (fCount > 0) pendingApprovals = aCount;
    } catch (_) { /* use defaults */ }
  }

  return {
    totalListings,
    availableListings,
    bookedListings,
    deliveredListings,
    totalContracts,
    activeContracts,
    escrowLocked,
    totalVolume,
    totalBalances,
    totalFarmers,
    pendingApprovals,
    listings: state.listings,
    contracts: state.contracts,
    ledgers: state.ledgers.slice(0, 20),
    balances: state.balances,
  };
}

export async function adminGetFarmers(): Promise<FarmerRecord[]> {
  const db = await getDB();
  if (db) {
    try {
      const count = await db.collection("admin_farmers").countDocuments();
      if (count === 0) {
        await db.collection("admin_farmers").insertMany(seedFarmers);
      }
      const docs = await db.collection<FarmerRecord>("admin_farmers").find().toArray();
      return docs.map(strip_id as any);
    } catch (_) { /* fallback */ }
  }
  return seedFarmers;
}

export async function adminAddFarmer(farmer: Omit<FarmerRecord, "id">): Promise<FarmerRecord> {
  const newId = `F-${Math.floor(100 + Math.random() * 899)}`;
  const newFarmer: FarmerRecord = {
    ...farmer,
    id: newId,
  };
  const newLand: LandExtract = {
    id: `LND-${Math.floor(200 + Math.random() * 799)}`,
    farmerId: newId,
    farmerName: farmer.name,
    surveyNo: `${Math.floor(100 + Math.random() * 400)}/A`,
    acreage: farmer.land,
    soil: "Medium Black (Uninspected)",
    cropSuitability: `Suitable for ${farmer.crop}`,
    file: `7-12-TEMP-${newId}.pdf`,
    inspected: false,
  };

  const db = await getDB();
  if (db) {
    try {
      await db.collection("admin_farmers").insertOne({ ...newFarmer });
      await db.collection("admin_land").insertOne({ ...newLand });
      return newFarmer;
    } catch (_) { /* fallback */ }
  }

  // Memory fallback push to seeds
  seedFarmers.unshift(newFarmer);
  seedLandExtracts.unshift(newLand);
  return newFarmer;
}

export async function adminVerifyFarmerLand(farmerId: string) {
  const db = await getDB();
  if (db) {
    try {
      await db.collection("admin_farmers").updateOne({ id: farmerId }, { $set: { status: "Verified" } });
      await db.collection("admin_land").updateMany({ farmerId }, { $set: { inspected: true } });
      return;
    } catch (_) { /* fallback */ }
  }

  const f = seedFarmers.find(x => x.id === farmerId);
  if (f) f.status = "Verified";
  seedLandExtracts.filter(l => l.farmerId === farmerId).forEach(l => l.inspected = true);
}

export async function adminLinkFarmerScheme(farmerId: string, schemeName: string) {
  const db = await getDB();
  if (db) {
    try {
      await db.collection("admin_farmers").updateOne(
        { id: farmerId },
        { $addToSet: { schemes: schemeName }, $set: { dbtStatus: "Linked" } }
      );
      return;
    } catch (_) { /* fallback */ }
  }

  const f = seedFarmers.find(x => x.id === farmerId);
  if (f) {
    if (!f.schemes.includes(schemeName)) f.schemes.push(schemeName);
    f.dbtStatus = "Linked";
  }
}

export async function adminGetLandExtracts(): Promise<LandExtract[]> {
  const db = await getDB();
  if (db) {
    try {
      const count = await db.collection("admin_land").countDocuments();
      if (count === 0) {
        await db.collection("admin_land").insertMany(seedLandExtracts);
      }
      const docs = await db.collection<LandExtract>("admin_land").find().toArray();
      return docs.map(strip_id as any);
    } catch (_) { /* fallback */ }
  }
  return seedLandExtracts;
}

export async function adminAuditLandExtract(extractId: string) {
  const db = await getDB();
  if (db) {
    try {
      const extract = await db.collection<LandExtract>("admin_land").findOne({ id: extractId });
      await db.collection("admin_land").updateOne({ id: extractId }, { $set: { inspected: true } });
      if (extract) {
        await db.collection("admin_farmers").updateOne({ id: extract.farmerId }, { $set: { status: "Verified" } });
      }
      return;
    } catch (_) { /* fallback */ }
  }

  const l = seedLandExtracts.find(x => x.id === extractId);
  if (l) {
    l.inspected = true;
    const f = seedFarmers.find(x => x.id === l.farmerId);
    if (f) f.status = "Verified";
  }
}

export async function adminGetAppraisals(): Promise<{
  appraisals: AppraisalRecord[];
  fertilizer: FertilizerLog[];
  aadhaar: AadhaarAudit[];
}> {
  const db = await getDB();
  if (db) {
    try {
      const aCount = await db.collection("admin_appraisals").countDocuments();
      if (aCount === 0) {
        await db.collection("admin_appraisals").insertMany(seedAppraisals);
        await db.collection("admin_fertilizer").insertMany(seedFertilizer);
        await db.collection("admin_aadhaar").insertMany(seedAadhaar);
      }
      const [appraisals, fertilizer, aadhaar] = await Promise.all([
        db.collection<AppraisalRecord>("admin_appraisals").find().toArray(),
        db.collection<FertilizerLog>("admin_fertilizer").find().toArray(),
        db.collection<AadhaarAudit>("admin_aadhaar").find().toArray(),
      ]);
      return {
        appraisals: appraisals.map(strip_id as any),
        fertilizer: fertilizer.map(strip_id as any),
        aadhaar: aadhaar.map(strip_id as any),
      };
    } catch (_) { /* fallback */ }
  }
  return { appraisals: seedAppraisals, fertilizer: seedFertilizer, aadhaar: seedAadhaar };
}

export async function adminUpdateAppraisal(id: string, status: string) {
  const db = await getDB();
  if (db) {
    try {
      await db.collection("admin_appraisals").updateOne({ id }, { $set: { status } });
      return;
    } catch (_) { /* fallback */ }
  }
  const app = seedAppraisals.find(x => x.id === id);
  if (app) app.status = status;
}

export async function adminGetActivity(): Promise<ActivityEvent[]> {
  const state = await storeGetState();

  const contractEvents: ActivityEvent[] = state.contracts.map((c) => ({
    id: c.id,
    type: "contract" as const,
    label: `Contract ${c.id}`,
    detail: `${c.crop} — ${c.qty} | ${c.status}`,
    amount: c.amount,
    date: c.date,
    status: c.status,
  }));

  const ledgerEvents: ActivityEvent[] = state.ledgers.slice(0, 15).map((l) => ({
    id: l.txHash,
    type: "ledger" as const,
    label: l.type,
    detail: `${l.crop} — ${l.fpo}`,
    amount: l.amount,
    date: l.date,
    status: l.status,
  }));

  const listingEvents: ActivityEvent[] = state.listings
    .filter((l) => l.status !== "Available")
    .map((l) => ({
      id: l.id,
      type: "listing" as const,
      label: `Listing ${l.id}`,
      detail: `${l.crop} — ${l.fpo} | ${l.status}`,
      date: new Date().toISOString().substring(0, 10),
      status: l.status,
    }));

  return [...contractEvents, ...ledgerEvents, ...listingEvents]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);
}


