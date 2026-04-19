"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQueryHistory, useVault, type HistoryEntry, type VaultItem } from "@/hooks/use-store";
import type { QueryResponse } from "@/types/api";

interface StoreContextType {
  history: HistoryEntry[];
  addHistoryEntry: (query: string, response: QueryResponse) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  vaultItems: VaultItem[];
  saveToVault: (item: Omit<VaultItem, "id" | "savedAt">) => VaultItem;
  removeFromVault: (id: string) => void;
  isInVault: (title: string, chunkText: string) => boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { history, addEntry, removeEntry, clearHistory } = useQueryHistory();
  const { items, saveToVault, removeFromVault, isInVault } = useVault();

  return (
    <StoreContext.Provider
      value={{
        history,
        addHistoryEntry: addEntry,
        removeHistoryEntry: removeEntry,
        clearHistory,
        vaultItems: items,
        saveToVault,
        removeFromVault,
        isInVault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
