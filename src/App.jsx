import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import ProgramSetup from "./pages/ProgramSetup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import { loadProgram, saveProgram } from "./lib/storage";

const THEME_KEY = "workout-tracker:theme";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "");

  useEffect(() => {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    else document.documentElement.removeAttribute("data-theme");
  }, [theme]);

  function toggle() {
    const current = theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    setTheme(next);
  }

  const isDark = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default function App() {
  const [program, setProgram] = useState(() => loadProgram());
  const [tab, setTab] = useState(() => (loadProgram() ? "dashboard" : "setup"));

  function handleSaveProgram(next) {
    const isFirstSave = !program;
    saveProgram(next);
    setProgram(next);
    if (isFirstSave) setTab("dashboard");
  }

  let page;
  if (tab === "setup" || !program) {
    page = <ProgramSetup program={program} onSave={handleSaveProgram} />;
  } else if (tab === "history") {
    page = <History />;
  } else {
    page = <Dashboard program={program} />;
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <ThemeToggle />
      </div>
      {page}
      <NavBar active={tab} onChange={setTab} disabled={!program} />
    </div>
  );
}
