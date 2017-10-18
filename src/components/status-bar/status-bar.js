import React from 'react'
import {inject, observer} from 'mobx-react'
import { View, TouchableOpacity, Image } from 'react-native'
import { EmptyCell } from '../cell/cell'
import images from '../../assets/images'
const statusBarStyle = {
  width: '100%',
  height: 60,
  marginBottom: 20,
  alignItems: 'center',
  justifyContent: 'center'
}
const StatusBar = ({cellSize, gameOver = false, onReset}) => {
  const image = gameOver === false ? images.smile : images.death
  return (
    <View style={statusBarStyle}>
      <TouchableOpacity onPress={onReset}>
        <EmptyCell width={cellSize} height={cellSize}>
          <Image source={image} />
        </EmptyCell>
      </TouchableOpacity>
    </View>
  )
}

@inject('gameStore') @observer
export default class StatusBarObserver extends React.Component {
  render () {
    const newProps = {...this.props}
    newProps.gameOver = this.props.gameStore.gameOver
    return <StatusBar {...newProps} />
  }
}
