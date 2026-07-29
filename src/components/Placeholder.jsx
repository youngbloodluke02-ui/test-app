export default function Placeholder({ title, note }) {
  return (
    <div className="card placeholder-card">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 12h2M18 12h2M8 7v10M16 7v10M8 12h8" />
      </svg>
      <strong>{title}</strong>
      <span>{note}</span>
    </div>
  );
}
