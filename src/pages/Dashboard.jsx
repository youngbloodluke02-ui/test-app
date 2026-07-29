import Placeholder from "../components/Placeholder";

export default function Dashboard({ program }) {
  return (
    <div>
      <p className="eyebrow">{program.name}</p>
      <h1>Today</h1>
      <p className="page-subtitle">Current week, next session, and adherence will live here.</p>
      <Placeholder
        title="Session logging is next"
        note="Once it's built, this dashboard will show your current week/session number, days since your last workout, and adherence."
      />
    </div>
  );
}
