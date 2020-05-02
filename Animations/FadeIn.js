import React from 'react'
import { Animated, Dimensions } from 'react-native'

class FadeIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      positionTop: new Animated.Value(Dimensions.get('window').width)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.positionTop,
      {
        toValue: 0,
        duration: 20000

      }
    ).start()
  }

  render() {
    return (
      <Animated.View
        style={{ top: this.state.positionTop }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default FadeIn
