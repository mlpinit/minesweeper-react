import React from 'react'
import './App.css'
import Cell from './Cell'
import {
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
} from './helpers'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
    document.addEventListener('contextmenu', event => event.preventDefault())
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  countSurroundingMines(board, position) {
    return neighborPositions(board, position).reduce((count, neighbor) => {
      return isMine(board[neighbor]) ? count + 1 : count
    }, 0)
  }

  countSurroundingMarks(board, position) {
    return neighborPositions(board, position).reduce((count, neighbor) => {
      return board[neighbor].marked ? count + 1 : count
    }, 0)
  }

  openCells = (board, position) => {
    const cell = board[position]
    if (cell.open) {
      return
    }
    cell.open = true
    if (isMine(cell)) {
      this.openMines(position)
      return
    }
    if (correctNumberOfMinesMarked(cell)) {
      neighborPositions(board, position).forEach(neighborPosition =>
        this.openCells(board, neighborPosition)
      )
    }
  }

  openMines = position => {
    this.setState({ gameOver: true })
    clearInterval(this.interval)
    this.setState(prevState => {
      let board = prevState.board.slice(0)
      board[position].clickedMine = true
      board.forEach(cell => {
        if (isMine(cell)) {
          cell.open = true
        }
      })
      return { board: board }
    })
  }

  tick = () => {
    this.setState(prevState => ({ seconds: prevState.seconds + 1 }))
  }

  generateBoard = position => {
    this.interval = setInterval(() => this.tick(), 1000)
    this.setState(prevState => {
      let board = prevState.board.slice(0)
      minesPositions(position).forEach(
        position => (board[position] = createMineCell())
      )
      board = board.map((cell, index) => {
        if (!isMine(cell)) {
          return createNonMineCell(this.countSurroundingMines(board, index))
        }
        return cell
      })
      this.openCells(board, position)
      return { board: board }
    })
  }

  updateMouseEvents = (position, event) => {
    this.setState(prevState => {
      let mouseEvents = prevState.mouseEvents.slice(0)
      mouseEvents[0] = mouseEvents[1]
      mouseEvents[1] = { type: event, position: position }
      return { mouseEvents: mouseEvents }
    })
  }
  mouseDown = position => {
    this.updateMouseEvents(position, 'down')
  }

  mouseUp = (position, event) => {
    if (this.state.gameOver) {
      return
    }
    if (!this.state.started) {
      this.setState({ started: true })
      this.generateBoard(position)
    }
    if (openNeighborsEvent(this.state.mouseEvents)) {
      this.handleOpenNeighborsEvent(position)
    } else if (markCellEvent(event)) {
      this.handleMarkCellEvent(position)
    } else if (openCellEvent(event)) {
      this.handleOpenCell(position)
    }
    this.updateMouseEvents(position, 'up')
  }

  handleOpenNeighborsEvent = position => {
    let board = this.state.board.slice(0)
    if (!board[position].open) {
      return
    }
    if (this.countSurroundingMarks(board, position) === board[position].value) {
      this.setState(prevState => {
        let board = prevState.board.slice(0)
        neighborPositions(this.state.board, position)
          .filter(position => !board[position].marked)
          .forEach(position => this.openCells(board, position))
        return { board: board }
      })
    }
  }

  handleMarkCellEvent = position => {
    if (this.state.board[position].open) {
      return
    }
    this.setState(prevState => {
      let board = prevState.board.slice(0)
      board[position].marked = !board[position].marked
      let difference = board[position].marked ? -1 : 1
      return { board: board, minesLeft: prevState.minesLeft + difference }
    })
  }

  handleOpenCell = position => {
    let cell = this.state.board[position]
    if (cell.marked) {
      return
    }
    if (isMine(cell)) {
      this.openMines(position)
    }
    this.setState(prevState => {
      let board = prevState.board.slice(0)
      this.openCells(board, position)
      return { board: board }
    })
  }

  restartButtonEmojy() {
    if (this.state.gameOver) {
      if (gameWon(this.state.board)) {
        return '😎'
      } else {
        return '😵'
      }
    } else if (this.state.mouseEvents[1].type === 'down') {
      return '😲'
    } else {
      return '🙂'
    }
  }

  restartGame = () => {
    this.setState(INITIAL_STATE)
    clearInterval(this.interval)
  }

  render() {
    const rows = this.state.boardDisplay.map((row, x) => {
      return row.map((cell, y) => {
        return (
          <Cell
            key={position(x, y)}
            className="Button Cell"
            x={x}
            y={y}
            position={position(x, y)}
            mouseUp={this.mouseUp}
            mouseDown={this.mouseDown}
            cell={this.state.board[position(x, y)]}
          />
        )
      })
    })
    const divSeparatedRows = rows.map((row, x) => (
      <div className="Row" key={x}>
        {row}
      </div>
    ))
    return (
      <div className="App">
        <h1>Minesweeper</h1>
        <div className="container">
          <div className="Mines-left">{this.state.minesLeft}</div>
          <div className="Restart-button" onClick={this.restartGame}>
            {this.restartButtonEmojy()}
          </div>
          <div className="Time-passed">{this.state.seconds}</div>
        </div>
        {divSeparatedRows}
      </div>
    )
  }
}

export default App
