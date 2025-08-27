// app/context/ListContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ListContextType {
  currentListId: string | null;
  setCurrentListId: (id: string | null) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: ReactNode }) {
  const [currentListId, setCurrentListId] = useState<string | null>(null);

  return (
    <ListContext.Provider value={{ currentListId, setCurrentListId }}>
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList deve ser usado dentro de ListProvider");
  }
  return context;
}
