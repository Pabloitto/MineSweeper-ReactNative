import { observable, action } from 'mobx'
import { Alert, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
const CELL_SIZE = 45
const TABLE_WIDTH = width * 0.80
const TABLE_HEIGHT = height * 0.70
const columns = Math.ceil(TABLE_WIDTH / CELL_SIZE)
const rows = Math.ceil(TABLE_HEIGHT / CELL_SIZE)
const MINES = 10
let interval = null

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
  @observable time = 0
  @observable activeMines = MINES
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
    this.time = 0
    this.activeMines = MINES
    this.populateCells()
    this.addMines(MINES)
    this.addBranches()
  }
  @action startTimer () {
    interval = setInterval(() => {
      this.time += 1
    }, 1000)
  }
  @action pushNewColor (number, color) {
    this.availableColors[number] = color
  }
  @action openCell (current) {
    this.openSubCell(current)
    if (current.mine === true) {
      clearInterval(interval)
      this.gameOver = true
      this.openMines()
      return
    }
    if (current.minesAround.length === 0) {
      current.cellsAround.forEach(cell => {
        const mines = cell.minesAround.length
        if (mines === 0 && cell.isOpen === false && cell.mine === false) {
          this.openSubCell(cell)
          this.openCell(cell)
        } else if (cell.isOpen === false && cell.mine === false) {
          this.openSubCell(cell)
        }
      })
    }
    this.winGame()
  }
  @action openSubCell (cell) {
    cell.isOpen = true
    if (cell.flag === true) {
      cell.flag = false
      this.activeMines++
    }
  }
  @action openMines () {
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.mine === true && cell.isOpen === false) {
          this.openSubCell(cell)
        }
      })
    })
  }
  @action setFlag (cell) {
    if (cell.flag === false && this.activeMines > 0) {
      cell.flag = true
      this.activeMines--
    } else if (cell.flag === true && this.activeMines < MINES) {
      cell.flag = false
      this.activeMines++
    }
    this.winGame()
  }
  @action reset () {
    clearInterval(interval)
    this.cells = []
    this.gameOver = false
    this.init()
    this.startTimer()
  }
  @action winGame () {
    let minesFound = 0
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.flag === true && cell.mine === true && cell.isOpen === false) {
          minesFound++
        }
      })
    })
    if (minesFound === MINES) {
      Alert.alert(
        'You win',
        'Congrats you win',
        [
          {text: 'OK', onPress: () => this.reset()},
        ]
      )
    }
  }
}
const getInstance = () => new GameStore()
export { getInstance, TABLE_HEIGHT, TABLE_WIDTH, CELL_SIZE }
export default getInstance()
