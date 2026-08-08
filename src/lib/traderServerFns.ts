// TanStack Start server functions — execute on the server only.
// The browser calls these as RPC; MongoDB credentials never leave the server.
import { createServerFn } from "@tanstack/react-start";
import {
  storeGetState,
  storeDeposit,
  storeAddListing,
  storeBuyListing,
  storeAcceptContract,
  storeUpdateShipment,
  storeReleaseEscrow,
} from "./mongodb";
import type { Listing, ContractStatus } from "./mockTraderDB";

// ---------- Server Functions ----------

export const getTraderState = createServerFn({ method: "GET" }).handler(async () => {
  return await storeGetState();
});

export const depositFunds = createServerFn({ method: "POST" })
  .validator((data: { userId: string; amount: number }) => data)
  .handler(async ({ data }) => {
    await storeDeposit(data.userId, data.amount);
    return { ok: true };
  });

export const addListing = createServerFn({ method: "POST" })
  .validator((data: Omit<Listing, "id" | "status">) => data)
  .handler(async ({ data }) => {
    const result = await storeAddListing(data);
    return result;
  });

export const buyListing = createServerFn({ method: "POST" })
  .validator((data: { listingId: string; traderId: string }) => data)
  .handler(async ({ data }) => {
    await storeBuyListing(data.listingId, data.traderId);
    return { ok: true };
  });

export const acceptContract = createServerFn({ method: "POST" })
  .validator((data: { contractId: string; sellerId: string }) => data)
  .handler(async ({ data }) => {
    await storeAcceptContract(data.contractId, data.sellerId);
    return { ok: true };
  });

export const updateShipment = createServerFn({ method: "POST" })
  .validator((data: { contractId: string; sellerId: string; newStatus: ContractStatus }) => data)
  .handler(async ({ data }) => {
    await storeUpdateShipment(data.contractId, data.sellerId, data.newStatus);
    return { ok: true };
  });

export const releaseEscrow = createServerFn({ method: "POST" })
  .validator((data: { contractId: string; traderId: string }) => data)
  .handler(async ({ data }) => {
    await storeReleaseEscrow(data.contractId, data.traderId);
    return { ok: true };
  });
