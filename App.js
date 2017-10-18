import React from 'react'
import { Provider } from 'mobx-react'
import { View, Dimensions } from 'react-native'
import Dashboard from './src/components/dashboard/dashboard'
import StatusBar from './src/components/status-bar/status-bar'
import GameStore, {CELL_SIZE, TABLE_WIDTH, TABLE_HEIGHT} from './src/stores/game-store'
const { height, width } = Dimensions.get('window')
const styles = {
  fullSize: {
    height: height,
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default () => {
  return (
    <Provider gameStore={GameStore} >
      <View style={styles.fullSize}>
        <StatusBar cellSize={CELL_SIZE} onReset={() => GameStore.reset()} gameOver={GameStore.gameOver} />
        <Dashboard width={TABLE_WIDTH} height={TABLE_HEIGHT} />
      </View>
    </Provider>
  )
}
