"use client";

import { createContext, useContext, useState } from "react";

interface AIDrawerCtx {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const Ctx = createContext<AIDrawerCtx>({ open: false, toggle: () => {}, close: () => {} });

export function AIDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAIDrawer = () => useContext(Ctx);
