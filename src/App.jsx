import { useEffect, useRef, useState } from 'react'
import ScoreBoard from './components/ScoreBoard.jsx'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import { createBoard, findMatches, resolveMatches, swapCandies } from './game.js'

// Keep the board's color names connected to their image assets.
const candyImages = {
  blue: blueCandy,
  green: greenCandy,
  orange: orangeCandy,
  purple: purpleCandy,
  red: redCandy,
  yellow: yellowCandy,
}

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState(createBoard)
  // Use a ref to keep track of the index of the candy being dragged.
  const draggedCandy = useRef(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  useEffect(() => {
    // Set up a timer to check for matches every 100 milliseconds.
    const timer = setInterval(() => {
      const matches = findMatches(currentColorArrangement)

      if (matches.size > 0) {
        // Update the score and resolve the matches on the board.
        setScoreDisplay(score => score + matches.size)
        // Use the functional form of setCurrentColorArrangement to ensure we have the latest board state.
        setCurrentColorArrangement(board => resolveMatches(board))
      }
    }, 100)

    return () => clearInterval(timer)
  }, [currentColorArrangement])

  // Only accept a drop when a candy was picked up from the board.
  const handleDrop = (targetIndex, event) => {
    event.preventDefault()
    // Use the ref to get the index of the candy being dragged.
    const sourceIndex = draggedCandy.current

    // Swap the candies on the board if a candy was being dragged.
    if (sourceIndex !== null) {
      // Use the functional form of setCurrentColorArrangement to ensure we have the latest board state.
      setCurrentColorArrangement(board => swapCandies(board, sourceIndex, targetIndex))
    }
    // Reset the dragged candy index after the drop.
    draggedCandy.current = null
  }

  return (
    <div className="app">
      <ScoreBoard score={scoreDisplay}/>
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyImages[candyColor]}
            alt={candyColor}
            draggable
            onDragStart={() => {
              draggedCandy.current = index
            }}
            onDragOver={event => event.preventDefault()}
            onDrop={event => handleDrop(index, event)}
            onDragEnd={() => {
              draggedCandy.current = null
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default App
