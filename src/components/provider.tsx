"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
  i18n?: Parameters<typeof RootProvider>[0]["i18n"];
}

export function Provider({ children, i18n }: ProviderProps) {
  return <RootProvider i18n={i18n}>{children}</RootProvider>;
}
