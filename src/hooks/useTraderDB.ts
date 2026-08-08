import { useState, useEffect } from "react";
import { traderDB } from "../lib/mockTraderDB";

export function useTraderDB() {
  const [dbState, setDbState] = useState(() => traderDB.getState());

  useEffect(() => {
    const handleUpdate = () => {
      setDbState({ ...traderDB.getState() });
    };

    window.addEventListener("trader-db-updated", handleUpdate);
    return () => {
      window.removeEventListener("trader-db-updated", handleUpdate);
    };
  }, []);

  return {
    state: dbState,
    deposit: (userId: string, amount: number) => traderDB.deposit(userId, amount),
    addListing: (listing: Parameters<typeof traderDB.addListing>[0]) => traderDB.addListing(listing),
    buyListing: (listingId: string, traderId: string) => traderDB.buyListing(listingId, traderId),
    acceptContract: (contractId: string, sellerId: string) => traderDB.acceptContract(contractId, sellerId),
    updateShipment: (contractId: string, sellerId: string, newStatus: Parameters<typeof traderDB.updateShipment>[2]) => traderDB.updateShipment(contractId, sellerId, newStatus),
    releaseEscrow: (contractId: string, traderId: string) => traderDB.releaseEscrow(contractId, traderId),
  };
}
