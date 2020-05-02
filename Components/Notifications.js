import React from 'react';
import styled from 'styled-components';
import {ScrollView, Animated, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from 'react-redux';

import ChatPage from './ChatPage';

let screenWidth = Dimensions.get('window').width;

function mapStateToProps(state) {
  return {action: state.action};
}

function mapDispatchToProps(dispatch) {
  return {
    closeNotif: () =>
      dispatch({
        type: 'CLOSE_NOTIF',
      }),
    updateName: name =>
      dispatch({
        type: 'UPDATE_NAME',
        name,
      }),
  };
}
class Notifications extends React.Component {
  state = {
    translateY: new Animated.Value(30),
    opacity: new Animated.Value(0),
    top: new Animated.Value(3000),
  };
  componentDidUpdate = () => {
    this.toggleNotif();
  };
  toggleNotif = () => {
    if (this.props.action == 'openNotif') {
      Animated.parallel([
        Animated.spring(this.state.translateY, {
          toValue: 0,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500,
        }),
        Animated.timing(this.state.top, {
          toValue: 0,
          duration: 0,
        }),
      ]).start();
    }

    if (this.props.action == 'closeNotif') {
      Animated.parallel([
        Animated.spring(this.state.translateY, {
          toValue: 30,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 500,
        }),
        Animated.timing(this.state.top, {
          toValue: 3000,
          duration: 0,
        }),
      ]).start();
    }
  };

  render() {
    return (
      <AnimatedContainer style={{top: this.state.top}}>
        <TouchableOpacity
          onPress={this.props.closeNotif}
          style={{
            position: 'absolute',
            top: 40,
            left: '50%',
            marginLeft: -22,
            zIndex: 100,
          }}>
          <CloseButton style={{elevation: 20}}>
            <Icon source={require('../Images/cancel.png')} />
          </CloseButton>
        </TouchableOpacity>

        <ChatPage />
      </AnimatedContainer>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notifications);
const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: #f0f3f5;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const CloseButton = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  justify-content: center;
  align-items: center;
  margin: 10px;
`;
const Icon = styled.Image`
  width: 34px;
  height: 34px;
`;
