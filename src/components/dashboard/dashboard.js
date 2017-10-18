import React from 'react'
import { observer, inject } from 'mobx-react'
import { View } from 'react-native'
import CellMatrix from '../cell-matrix/cell-matrix'
const styles = {
  dashboard: (width, height) => ({
    height: height,
    width: width
  })
}

@inject('gameStore') @observer
export default class  Dashboard extends React.Component {
  render () {
    const { gameStore, width, height } = this.props
    return (
      <View style={styles.dashboard(width, height)}>
        <CellMatrix cells={gameStore.cells} />
      </View>
    )
  }
}
