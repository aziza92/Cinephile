import React from 'react';
import styled from 'styled-components';
import {Animated, Image, TouchableOpacity, Dimensions} from 'react-native';
import MenuItem from './MenuItem';
import {connect} from 'react-redux';

const screenHeight = Dimensions.get('window').height;

function mapStateToProps(state) {
  return {action: state.action};
}
function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () =>
      dispatch({
        type: 'CLOSE_MENU',
      }),
    updateName: name =>
      dispatch({
        type: 'UPDATE_NAME',
        name,
      }),
  };
}

class Menu extends React.Component {
  state = {
    top: new Animated.Value(900),
  };

  componentDidMount() {
    this.toggleMenu();
  }
  componentDidUpdate() {
    this.toggleMenu();
  }

  toggleMenu = () => {
    if (this.props.action == 'openMenu') {
      Animated.spring(this.state.top, {
        toValue: 54,
      }).start();
    }
    if (this.props.action == 'closeMenu') {
      Animated.spring(this.state.top, {
        toValue: screenHeight,
      }).start();
    }
  };

  render() {
    return (
      <AnimatedContainer style={{top: this.state.top}}>
        <Cover>
          <Photo source={require('../Images/background5.jpg')} />
          <Title>Menu</Title>
        </Cover>
        <TouchableOpacity
          onPress={this.props.closeMenu}
          style={{
            position: 'absolute',
            top: 120,
            left: '50%',
            marginLeft: -22,
            zIndex: 1,
          }}>
          <CloseView>
            <Image source={require('../Images/Icon.png')} size={30} />
          </CloseView>
        </TouchableOpacity>
        <Content>
          <MenuItem />
        </Content>
      </AnimatedContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

const Container = styled.View`
  position: absolute;
  background: white;
  width: 100%;
  height: 100%;
  z-index: 100;
  border-radius: 10px;
  overflow: hidden;
`;
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Cover = styled.View`
  height: 142px;
  align-items: center;
  justify-content: center;
`;
const Photo = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;
const Title = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: 600;
`;

const Content = styled.View`
  height: 900px;
  background: #f0f3f5;
  padding: 50px;
`;
const CloseView = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: white;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
`;
