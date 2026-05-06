"use client";

import { SessionProvider } from "next-auth/react";
import { AIDrawerProvider } from "@/context/AIDrawerContext";
import AIChatDrawer from "@/components/AIChatDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AIDrawerProvider>
        {children}
        <AIChatDrawer />
      </AIDrawerProvider>
    </SessionProvider>
  );
}
