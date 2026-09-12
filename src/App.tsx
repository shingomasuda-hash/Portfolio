import { useEffect, useState } from "react";
import { portfolioProjects } from "./data/portfolioProjects";
import { Stage } from "./three/Stage";
import { Overlay } from "./components/Overlay";
import { stage, useExperience } from "./state/experience";

const SHELF_THEME = {
  background: "#E3E0D7",
  surface: "#F4F2EC",
  accent: "#2D3331",
  secondary: "#6B806B",
};

export default function App() {
  const [booting, setBooting] = useState(true);
  const index = useExperience((s) => s.index);
  const mode = useExperience((s) => s.mode);
  const project = portfolioProjects[index];
  const theme = mode === "reading" ? project.theme : SHELF_THEME;

  useEffect(() => {
    stage.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const ready = fonts ? fonts.ready : Promise.resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => setTimeout(() => setBooting(false), 320));
    };
    ready.then(finish);
    /* never let a slow font block the experience */
    const t = window.setTimeout(finish, 2600);
    return () => window.clearTimeout(t);
  }, []);

  /* dev-only handle so the experience can be driven from a test harness */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    (window as unknown as { __anyware?: unknown; __stage?: unknown }).__anyware = useExperience;
    (window as unknown as { __stage?: unknown }).__stage = stage;
    const ts = Number(new URLSearchParams(location.search).get("ts"));
    if (Number.isFinite(ts) && ts > 0) stage.timeScale = Math.min(12, ts);
  }, []);

  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--bg", theme.background);
    r.setProperty("--surface", theme.surface);
    r.setProperty("--accent", theme.accent);
    r.setProperty("--secondary", theme.secondary);
  }, [theme]);

  return (
    <>
      {!booting && <Stage />}
      {!booting && <Overlay />}
      <div className="intro" data-hide={!booting}>
        <div>
          <b>ANYWARE ARCHIVE</b>
          <em>
            本を開くと、
            <br />
            その業種が立ち上がる。
          </em>
          <i />
        </div>
      </div>
    </>
  );
}
