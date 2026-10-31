const ScoreBoard = ({ score }) => {
  // Announce score changes without changing the existing board layout.
  return (
    <div className="score-board" aria-live="polite">
      <h2>Score: {score}</h2>
    </div>
  )
}

export default ScoreBoard