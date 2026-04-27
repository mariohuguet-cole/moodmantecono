import { useState, useEffect, useCallback } from "react";

export type Mood = "incredible" | "good" | "normal" | "bad" | "horrible";
export type Energy = "low" | "medium" | "high";

export interface JournalEntry {
  date: string; // YYYY-MM-DD
  emoji: Mood;
  energy: Energy;
  word: string;
  note: string;
  timestamp: number;
}

export function useJournal() {
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mudmantecosa_entries");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored entries", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mudmantecosa_entries", JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const saveEntry = useCallback((entry: JournalEntry) => {
    setEntries((prev) => ({
      ...prev,
      [entry.date]: entry,
    }));
  }, []);

  const getEntry = useCallback(
    (date: string): JournalEntry | undefined => {
      return entries[date];
    },
    [entries]
  );

  return {
    entries,
    saveEntry,
    getEntry,
    isLoaded,
  };
}
