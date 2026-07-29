import Placeholder from "../components/Placeholder";

export default function History() {
  return (
    <div>
      <p className="eyebrow">Past sessions</p>
      <h1>History</h1>
      <p className="page-subtitle">Every logged session, with per-exercise progress charts.</p>
      <Placeholder
        title="Nothing logged yet"
        note="Once session logging is built, completed workouts will show up here — tap one to see exactly what you lifted."
      />
    </div>
  );
}
