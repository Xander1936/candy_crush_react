import { useState, useEffect } from 'react'

const width = 8

const candyColors = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow'
]

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([])

  const checkForColumnOfFour = () => {
    for (let i = 0; i < 39; i++) {
      // Check if the current square is in the last two columns
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      // Get the color of the current square
      const decidedColor = currentColorArrangement[i]
      // Check if the current square is blank
      const isBlank = currentColorArrangement[i] === ''

      // Check if all squares in the column of four have the same color and are not blank
      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        console.log('column of four');
        // Set the color of the squares in the column of four to blank
        columnOfFour.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      // Check if the current square is in the last two columns
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      // Get the color of the current square
      const decidedColor = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]

      if (notValid.includes(i)) continue

      // Check if all squares in the row of four have the same color and are not blank
      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        // console.log('row of four');
        // Set the color of the squares in the column of four to blank
        rowOfFour.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i < 47; i++) {
      // Check if the current square is in the last two columns
      const columnOfThree = [i, i + width, i + width * 2]
      // Get the color of the current square
      const decidedColor = currentColorArrangement[i]
      // Check if the current square is blank
      const isBlank = currentColorArrangement[i] === ''

      // Check if all squares in the column of three have the same color and are not blank
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        console.log('column of three');
        // Set the color of the squares in the column of three to blank
        columnOfThree.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      // Check if the current square is in the last two columns
      const rowOfThree = [i, i + 1, i + 2]
      // Get the color of the current square
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if (notValid.includes(i)) continue

      // Check if all squares in the row of three have the same color and are not blank
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        // console.log('row of three');
        // Set the color of the squares in the column of three to blank
        rowOfThree.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }


  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < width * width; i++){
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorArrangement.push(randomColor)
    }
    // console.log(randomColorArrangement);
    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()

      // Update the state to trigger a re-render
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100)
    return () => clearInterval(timer)

  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, currentColorArrangement])

  console.log(currentColorArrangement);
  

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
            <img 
              key={index} 
              style={{backgroundColor: candyColor}}
              alt={candyColor} 
            />
          ))
        }
      </div>
    </div>
  )
}

export default App
