const TABS = [
  { key: "dashboard", label: "Today", icon: "M4 12h2M18 12h2M8 7v10M16 7v10M8 12h8" },
  { key: "history", label: "History", icon: "M4 6h16M4 12h16M4 18h10" },
  { key: "setup", label: "Program", icon: "M12 4v16M4 12h16" },
];

export default function NavBar({ active, onChange, disabled }) {
  return (
    <nav className="nav-bar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={"nav-btn" + (active === tab.key ? " active" : "")}
          onClick={() => onChange(tab.key)}
          disabled={disabled && tab.key !== "setup"}
          aria-current={active === tab.key ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={tab.icon} />
          </svg>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
