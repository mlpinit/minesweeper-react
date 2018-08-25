import { ROWS, COLUMNS, NR_OF_MINES } from './constants'
import { MINE } from './constants'

let minesPositions = position => {
  let set = new Set()
  set.add(position)
  let generateNumber = () => {
    const number = Math.floor(Math.random() * (ROWS * COLUMNS - 1))
    if (set.has(number)) {
      return generateNumber()
    }
    set.add(number)
    return number
  }
  return new Array(99).fill(1).map(() => generateNumber())
}

let withinBoundaries = coord => {
  return 0 <= coord.x && coord.x < ROWS && 0 <= coord.y && coord.y < COLUMNS
}

let position = (x, y) => {
  return x * COLUMNS + y
}

let neighborPositions = (board, pos) => {
  const row = Math.floor(pos / COLUMNS)
  const column = pos % COLUMNS
  let offsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]
  return offsets
    .map(offset => ({ x: row + offset[0], y: column + offset[1] }))
    .filter(coord => withinBoundaries(coord))
    .map(coord => position(coord.x, coord.y))
}

let cellInitialState = () => {
  return {
    value: ' ',
    open: false,
    marked: false,
    clickedMine: false,
  }
}

let createMineCell = () => {
  const cell = cellInitialState()
  cell.value = MINE
  return cell
}

let createNonMineCell = value => {
  const cell = cellInitialState()
  cell.value = value
  return cell
}

let isMine = cell => {
  return cell.value === MINE
}

let correctNumberOfMinesMarked = cell => {
  return cell.value === 0
}

let openNeighborsEvent = events => {
  return events[0].type === 'down' && events[1].type === 'down'
}

let markCellEvent = event => {
  return event.button === 2
}

let openCellEvent = event => {
  return event.button === 0
}

let gameWon = board => {
  let openCellsCount = 0
  board.forEach(cell => {
    if (!isMine(cell) && cell.open) {
      openCellsCount++
    }
  })
  return openCellsCount === 30 * 16 - 99
}

const INITIAL_STATE = {
  seconds: 0,
  minesLeft: NR_OF_MINES,
  gameOver: false,
  started: false,
  boardDisplay: new Array(ROWS).fill(new Array(COLUMNS).fill(1)),
  board: new Array(ROWS * COLUMNS).fill(cellInitialState()),
  mouseEvents: new Array(2).fill({ type: null, position: null }),
}

export {
  minesPositions,
  neighborPositions,
  position,
  INITIAL_STATE,
  createMineCell,
  createNonMineCell,
  isMine,
  correctNumberOfMinesMarked,
  openNeighborsEvent,
  markCellEvent,
  openCellEvent,
  gameWon,
}
