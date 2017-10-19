import { observable, action } from 'mobx'
import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
const CELL_SIZE = 45
const TABLE_WIDTH = width * 0.80
const TABLE_HEIGHT = height * 0.70
const columns = Math.ceil(TABLE_WIDTH / CELL_SIZE)
const rows = Math.ceil(TABLE_HEIGHT / CELL_SIZE)

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 10)];
  }
  return color;
}

class CellObj {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.width = CELL_SIZE
    this.height = CELL_SIZE
  }
  @observable cellsAround = []
  @observable minesAround = []
  @observable isOpen = false
  @observable flag = false
  @observable mine = false
}

class GameStore {
  @observable availableColors = {}
  @observable cells = []
  @observable gameOver = false
  constructor () {
    this.init()
  }
  populateCells () {
    for (let y = 0; y < rows; y++) {
      const row = []
      for (let x = 0; x < columns; x++) {
        const cell = new CellObj(x, y)
        row.push(cell)
      }
      this.cells.push(row)
    }
  }
  addMines (mines) {
    for (let i = 0; i < mines; i++) {
      const cell = this.cells[Math.floor(Math.random() * rows)][Math.floor(Math.random() * columns)]
      if (cell.mine === true) {
        i--
      } else {
        cell.mine = true
      }
    }
  }
  addBranches () {
    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.cellsAround = this.cellsAround(cell)
        cell.minesAround = cell.cellsAround.filter(i => i.mine === true)
        if (cell.minesAround.length > 0) {
          this.pushNewColor(cell.minesAround.length.toString(), getRandomColor())
        }
      })
    })
  }
  cellsAround = ({x, y}) => {
    const data = []
    for (let i = y - 1; i <= y + 1; i++) {
      if (i < 0 || i >= rows) continue
      for (let j = x - 1; j <= x + 1; j++) {
        if (j < 0 || j >= columns) continue
        if (x === j && y === i) continue
        data.push(this.cells[i][j])
      }
    }
    return data
  }
  @action init () {
    this.populateCells()
    this.addMines(10)
    this.addBranches()
  }
  @action pushNewColor (number, color) {
    this.availableColors[number] = color
  }
  @action openCell (current) {
    current.isOpen = true
    if (current.mine === true) {
      this.gameOver = true
      this.openMines()
      return
    }
    if (current.minesAround.length === 0) {
      current.cellsAround.forEach(cell => {
        const mines = cell.minesAround.length
        if (mines === 0 && cell.isOpen === false && cell.mine === false) {
          cell.isOpen = true
          this.openCell(cell)
        } else if (cell.isOpen === false && cell.mine === false) {
          cell.isOpen = true
        }
      })
    }
  }
  @action openMines () {
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.mine === true && cell.isOpen === false) {
          cell.isOpen = true
        }
      })
    })
  }
  @action setFlag (cell) {
    cell.flag = !cell.flag
  }
  @action reset () {
    this.cells = []
    this.gameOver = false
    this.init()
  }
}
const getInstance = () => new GameStore()
export { getInstance, TABLE_HEIGHT, TABLE_WIDTH, CELL_SIZE }
export default getInstance()
