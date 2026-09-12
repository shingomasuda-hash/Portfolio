import { createContext, useContext } from "react";
import type { Palette } from "../lib/screens";
import type { PortfolioProject } from "../data/portfolioProjects";

export type SceneCtx = {
  palette: Palette;
  project: PortfolioProject;
  scene: number;
};

export const SceneContext = createContext<SceneCtx | null>(null);

export function useScene() {
  const v = useContext(SceneContext);
  if (!v) throw new Error("useScene must be used inside a diorama");
  return v;
}

export function paletteOf(p: PortfolioProject): Palette {
  return {
    bg: p.theme.background,
    surface: p.theme.surface,
    ink: "#1E1F1D",
    accent: p.theme.accent,
    secondary: p.theme.secondary,
  };
}
