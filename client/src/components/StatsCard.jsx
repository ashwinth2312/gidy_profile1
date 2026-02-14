import "../styles/StatsCard.css";

export function StatsCard({ educationCount, projectsCount }) {
  return (
    <div className="statsContainer">
      <div className="statItem">
        <div className="statIcon">🎓</div>
        <div className="statContent">
          <p className="statLabel">Education</p>
          <p className="statValue">{educationCount}</p>
        </div>
      </div>

      <div className="statDivider"></div>

      <div className="statItem">
        <div className="statIcon">💻</div>
        <div className="statContent">
          <p className="statLabel">Projects</p>
          <p className="statValue">{projectsCount}</p>
        </div>
      </div>
    </div>
  );
}