import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContractStatus, Listing } from "../lib/mockTraderDB";
import {
  getTraderState,
  depositFunds,
  addListing,
  buyListing,
  acceptContract,
  updateShipment,
  releaseEscrow,
} from "../lib/traderServerFns";

const QUERY_KEY = ["traderState"];

const EMPTY_STATE = {
  listings: [] as any[],
  contracts: [] as any[],
  ledgers: [] as any[],
  balances: {} as Record<string, number>,
};

export function useTraderDB() {
  const queryClient = useQueryClient();

  const { data: state = EMPTY_STATE, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getTraderState(),
    // Refetch every 15s so Seller/Trader views stay in sync
    refetchInterval: 15_000,
    staleTime: 5_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  return {
    state,
    isLoading,

    deposit: async (userId: string, amount: number) => {
      await depositFunds({ data: { userId, amount } });
      await invalidate();
    },

    addListing: async (listing: Omit<Listing, "id" | "status">) => {
      const result = await addListing({ data: listing });
      await invalidate();
      return result;
    },

    buyListing: async (listingId: string, traderId: string) => {
      await buyListing({ data: { listingId, traderId } });
      await invalidate();
    },

    acceptContract: async (contractId: string, sellerId: string) => {
      await acceptContract({ data: { contractId, sellerId } });
      await invalidate();
    },

    updateShipment: async (contractId: string, sellerId: string, newStatus: ContractStatus) => {
      await updateShipment({ data: { contractId, sellerId, newStatus } });
      await invalidate();
    },

    releaseEscrow: async (contractId: string, traderId: string) => {
      await releaseEscrow({ data: { contractId, traderId } });
      await invalidate();
    },
  };
}
