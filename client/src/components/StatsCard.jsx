import "../styles/StatsCard.css";

export function StatsCard({ educationCount = 0, projectsCount = 0, skillsCount = 0 }) {
  return (
    <div className="statsGrid">
      <div className="statItem">
        <div className="statValue">{educationCount}</div>
        <div className="statLabel">Education</div>
      </div>
      <div className="statItem">
        <div className="statValue">{projectsCount}</div>
        <div className="statLabel">Projects</div>
      </div>
      <div className="statItem">
        <div className="statValue">{skillsCount}</div>
        <div className="statLabel">Skills</div>
      </div>
    </div>
  );
}