import assert from 'node:assert/strict'
import test from 'node:test'
import { createBoard, findMatches, resolveMatches, swapCandies } from './game.js'

// Alternating colors make accidental matches easy to spot in each test.
const createAlternatingBoard = () =>
  Array.from({ length: 64 }, (_, index) =>
    (Math.floor(index / 8) + (index % 8)) % 2 === 0 ? 'red' : 'blue',
  )

test('creates a board without initial matches', () => {
  const board = createBoard(() => 0)

  assert.equal(board.length, 64)
  assert.deepEqual([...findMatches(board)], [])
})

test('finds horizontal and vertical matches without wrapping rows', () => {
  const board = createAlternatingBoard()
  board[16] = 'green'
  board[17] = 'green'
  board[18] = 'green'
  board[3] = 'purple'
  board[11] = 'purple'
  board[19] = 'purple'
  board[7] = 'yellow'
  board[8] = 'yellow'
  board[9] = 'yellow'

  assert.deepEqual(
    [...findMatches(board)].sort((left, right) => left - right),
    [3, 11, 16, 17, 18, 19],
  )
})

test('swaps adjacent candies only when the move creates a match', () => {
  const board = createAlternatingBoard()
  board[9] = 'red'

  const swappedBoard = swapCandies(board, 1, 9)

  assert.notEqual(swappedBoard, board)
  assert.equal(swappedBoard[1], 'red')
  assert.equal(swappedBoard[9], 'blue')
  assert.equal(swapCandies(board, 0, 1), board)
  assert.equal(swapCandies(board, 7, 8), board)

  board[16] = 'green'
  board[17] = 'green'
  board[18] = 'green'
  assert.equal(swapCandies(board, 0, 1), board)
})

test('clears matches, drops candies, and refills the board', () => {
  const board = createAlternatingBoard()
  board[16] = 'green'
  board[17] = 'green'
  board[18] = 'green'

  const nextBoard = resolveMatches(board, () => 0)

  assert.equal(nextBoard.length, 64)
  assert.ok(nextBoard.every(Boolean))
  assert.notEqual(nextBoard, board)
  assert.deepEqual(board.slice(16, 19), ['green', 'green', 'green'])
})
