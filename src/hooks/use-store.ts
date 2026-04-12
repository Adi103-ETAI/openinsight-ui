import { useState, useEffect, useCallback } from "react";
import type { QueryResponse } from "@/types/api";

export interface HistoryEntry {
  id: string;
  query: string;
  timestamp: number;
  sourcesUsed: string[];
  model?: string;
  response?: QueryResponse;
}

export interface VaultItem {
  id: string;
  title: string;
  sourceType: string;
  chunkText: string;
  score: number;
  savedAt: number;
  queryContext: string;
  mongoId?: string;
}

const HISTORY_KEY = "openinsight_history";
const VAULT_KEY = "openinsight_vault";

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── History Hook ───
export function useQueryHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadFromStorage(HISTORY_KEY, []));

  useEffect(() => {
    saveToStorage(HISTORY_KEY, history);
  }, [history]);

  const addEntry = useCallback((query: string, response: QueryResponse) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      sourcesUsed: [...new Set(response.citations.map((c) => c.source_type))],
      model: response.model,
      response,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 50));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}

// ─── Vault Hook ───
export function useVault() {
  const [items, setItems] = useState<VaultItem[]>(() => loadFromStorage(VAULT_KEY, []));

  useEffect(() => {
    saveToStorage(VAULT_KEY, items);
  }, [items]);

  const saveToVault = useCallback((item: Omit<VaultItem, "id" | "savedAt">) => {
    const newItem: VaultItem = {
      ...item,
      id: Date.now().toString(),
      savedAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const removeFromVault = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInVault = useCallback(
    (title: string, chunkText: string) => {
      return items.some((i) => i.title === title && i.chunkText === chunkText);
    },
    [items]
  );

  return { items, saveToVault, removeFromVault, isInVault };
}
