import React from 'react'
import { COLUMNS, ROWS } from './constants'

class Cell extends React.Component {
  mouseDown = event => {
    this.props.mouseDown(this.props.position, event)
  }

  mouseUp = event => {
    this.props.mouseUp(this.props.position, event)
  }

  get cssClasses() {
    let values = this.props.className
    let cell = this.props.cell
    if (this.props.x === ROWS - 1) {
      values += ' Button-bottom'
    }
    if (this.props.y === COLUMNS - 1) {
      values += ' Button-right'
    }
    if (cell.marked) {
      values += ' Marked-button'
    }
    if (cell.open) {
      values += ` Cell${cell.value} Open-button`
    } else {
      values += ' Closed-button'
    }
    if (cell.clickedMine) {
      values += ' Clicked-mine'
    }
    return values
  }

  get value() {
    let cell = this.props.cell
    return cell.open ? cell.value : ' '
  }

  render() {
    return (
      <span
        className={this.cssClasses}
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
      >
        {this.value}
      </span>
    )
  }
}

export default Cell
