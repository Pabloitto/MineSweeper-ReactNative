import React from 'react'
import { observer, inject } from 'mobx-react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import images from '../../assets/images'
const { hairlineWidth } = StyleSheet

const styles = {
  cell: ({width, height, isOpen}) => {
    let color = isOpen ? '#ddd' : '#fff'
    return {
      backgroundColor: color,
      height: height,
      width: width,
      borderColor: '#000',
      borderBottomWidth: hairlineWidth,
      borderTopWidth: hairlineWidth,
      borderLeftWidth: hairlineWidth,
      borderRightWidth: hairlineWidth,
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  numberText: (color) => ({
    color: color,
    fontWeight: '600',
    fontSize: 16
  })
}

const createStyle = ({x, y, width, height}) => {
  return {
    position: 'absolute',
    top: y * height,
    left: x * width
  }
}

const EmptyCell = (props) => {
  return <View style={styles.cell(props)}>
    {props.children}
  </View>
}

export { EmptyCell }
@inject('gameStore') @observer
export default class Cell extends React.Component {
  constructor (props) {
    super(props)
    this.gameStore = this.props.gameStore
    this.onSelect = this.onSelect.bind(this)
    this.onLongSelect = this.onLongSelect.bind(this)
  }
  get minesAround () {
    const { cell } = this.props
    return cell.cellsAround.filter(item => item.mine === true)
  }
  onSelect () {
    const { cell } = this.props
    if (cell.flag === false) {
      this.gameStore.openCell(cell)
    }
  }
  onLongSelect () {
    const { cell } = this.props
    if (cell.isOpen === false) {
      this.gameStore.setFlag(cell)
    }
  }
  renderFlag ({flag}) {
    if (flag === true) {
      return <Image source={images.flag} />
    }
  }
  renderMine ({isOpen, mine}) {
    if (isOpen === true && mine === true) {
      return <Image source={images.explosion} />
    }
  }
  renderNumber ({isOpen, mine}) {
    const mines = this.minesAround.length
    if (isOpen === true && mine === false &&  mines > 0) {
      const color = this.gameStore.availableColors[mines.toString()]
      return <Text style={styles.numberText(color)}>
        {this.minesAround.length}
      </Text>
    }
  }
  renderCell (newProps) {
    if (this.gameStore.gameOver === false && newProps.isOpen === false) {
      return <TouchableOpacity
        style={createStyle(newProps)}
        onPress={this.onSelect}
        onLongPress={this.onLongSelect}>
        <EmptyCell {...newProps}>
          {this.renderNumber(newProps)}
          {this.renderFlag(newProps)}
          {this.renderMine(newProps)}
        </EmptyCell>
      </TouchableOpacity>
    } else {
      return <View style={createStyle(newProps)}>
        <EmptyCell {...newProps}>
          {this.renderNumber(newProps)}
          {this.renderFlag(newProps)}
          {this.renderMine(newProps)}
        </EmptyCell>
      </View>
    }
  }
  render () {
    const { cell } = this.props
    const newProps = { ...cell }
    return (this.renderCell(newProps))
  }
}
