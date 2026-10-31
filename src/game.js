// The width of the board in candies.
export const width = 8

// The colors of the candies.
export const candyColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow']

// Create a new board with no matches.
export const createBoard = (random = Math.random) => {
  const board = []

  // Fill the board with random candies, ensuring that no matches are created.
  for (let index = 0; index < width * width; index += 1) {
    // Determine the row and column of the current index.
    const column = index % width
    // Determine if placing a candy of the same color as the previous two candies would create a match.
    const row = Math.floor(index / width)
    // Check if placing a candy of the same color as the previous two candies would create a match.
    const createsHorizontalMatch =
      column >= 2 && board[index - 1] === board[index - 2]
    // Check if placing a candy of the same color as the previous two candies would create a match.
    const createsVerticalMatch =
      row >= 2 &&
      board[index - width] === board[index - width * 2]
    // Filter the available colors to exclude those that would create a match.
    const availableColors = candyColors.filter(
      color =>
        !(createsHorizontalMatch && board[index - 1] === color) &&
        !(createsVerticalMatch && board[index - width] === color),
    )
    // Randomly select a color from the available colors and add it to the board.
    board.push(
      availableColors[Math.floor(random() * availableColors.length)],
    )
  }

  // Return the newly created board with no matches.
  return board
}

// Collect every horizontal and vertical run of at least three candies.
export const findMatches = board => {
  const matches = new Set()

  // Check for horizontal matches.
  for (let row = 0; row < width; row += 1) {
    let column = 0

    // Find horizontal matches in this row.
    while (column < width) {
      const start = row * width + column
      const color = board[start]
      let end = column + 1

      // Find the end of the run of candies with the same color.
      while (color && end < width && board[row * width + end] === color) {
        end += 1
      }

      // If a run of at least three candies was found, add their indices to the set.
      if (color && end - column >= 3) {
        // Add the indices of the matched candies to the set.
        for (let matchColumn = column; matchColumn < end; matchColumn += 1) {
          matches.add(row * width + matchColumn)
        }
      }

      column = end
    }
  }

  // Check for vertical matches.
  for (let column = 0; column < width; column += 1) {
    let row = 0

    // Find vertical matches in this column.
    while (row < width) {
      const start = row * width + column
      const color = board[start]
      let end = row + 1

      // Find the end of the run of candies with the same color.
      while (color && end < width && board[end * width + column] === color) {
        end += 1
      }

      // If a run of at least three candies was found, add their indices to the set.
      if (color && end - row >= 3) {
        for (let matchRow = row; matchRow < end; matchRow += 1) {
          matches.add(matchRow * width + column)
        }
      }

      row = end
    }
  }

  return matches
}

// Swap two candies on the board if they are adjacent and the swap creates a match.
export const swapCandies = (board, sourceIndex, targetIndex) => {
  // Determine if the two indices are adjacent on the board.
  const isAdjacent =
    (Math.abs(sourceIndex - targetIndex) === 1 &&
      Math.floor(sourceIndex / width) === Math.floor(targetIndex / width)) ||
    Math.abs(sourceIndex - targetIndex) === width

  // If the indices are invalid or the candies are not adjacent, return the board unchanged.
  if (
    board.length !== width * width ||
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex >= board.length ||
    targetIndex >= board.length ||
    !isAdjacent
  ) {
    return board
  }

  // Swap the candies and check for matches.
  const swappedBoard = [...board]
  ;[swappedBoard[sourceIndex], swappedBoard[targetIndex]] = [
    swappedBoard[targetIndex],
    swappedBoard[sourceIndex],
  ]

  // If the swap creates a match, return the new board; otherwise, return the original board.
  const matches = findMatches(swappedBoard)
  return matches.has(sourceIndex) || matches.has(targetIndex) ? swappedBoard : board
}

// Clear matches, apply gravity within each column, and refill empty cells.
export const resolveMatches = (board, random = Math.random) => {
  const matches = findMatches(board)

  // If there are no matches, return the board unchanged.
  if (matches.size === 0) {
    return board
  }

  // Create a new board with the matched candies removed.
  const nextBoard = [...board]
  matches.forEach(index => {
    nextBoard[index] = ''
  })

  // Apply gravity within each column and refill empty cells with new random candies.
  for (let column = 0; column < width; column += 1) {
    const remainingCandies = []

    // Collect the remaining candies in this column, starting from the bottom.
    for (let row = width - 1; row >= 0; row -= 1) {
      const color = nextBoard[row * width + column]
      if (color) remainingCandies.push(color)
    }

    // Fill the column from the bottom with the remaining candies and new random candies.
    for (let row = width - 1; row >= 0; row -= 1) {
      nextBoard[row * width + column] =
        remainingCandies.shift() ??
        candyColors[Math.floor(random() * candyColors.length)]
    }
  }

  return nextBoard
}
