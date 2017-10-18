import React from 'react'
import { View } from 'react-native'
import Cell from '../cell/cell'
const renderCells = (cells) => {
  let index = 0
  const elements = []
  cells.forEach(row => {
    row.forEach(cell => {
      elements.push(<Cell key={++index} cell={cell} />)
    })
  })
  return elements
}

export default ({cells}) => {
  return <View>
    {renderCells(cells)}
  </View>
}
