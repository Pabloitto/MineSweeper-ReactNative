import React from 'react'
import {inject, observer} from 'mobx-react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { EmptyCell } from '../cell/cell'
import moment from 'moment'
import images from '../../assets/images'
const statusBarStyle = {
  width: '100%',
  height: 60,
  marginBottom: 20,
  alignItems: 'center',
  justifyContent: 'center'
}
const StatusBar = ({cellSize, mines, time = 0, gameOver = false, onReset}) => {
  const image = gameOver === false ? images.smile : images.death
  const formatTime = moment().startOf('day').seconds(time).format('mm:ss')
  return (
    <View style={statusBarStyle}>
      <Text>
        MINES: {mines}
      </Text>
      <TouchableOpacity onPress={onReset}>
        <EmptyCell width={cellSize} height={cellSize}>
          <Image source={image} />
        </EmptyCell>
      </TouchableOpacity>
      <Text>
        TIME: {formatTime}
      </Text>
    </View>
  )
}

@inject('gameStore') @observer
export default class StatusBarObserver extends React.Component {
  componentDidMount () {
    this.props.gameStore.startTimer()
  }
  render () {
    const newProps = {...this.props}
    newProps.gameOver = this.props.gameStore.gameOver
    newProps.time = this.props.gameStore.time
    newProps.mines = this.props.gameStore.activeMines
    return <StatusBar {...newProps} />
  }
}
