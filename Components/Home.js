import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import Menu from './Menu';
import {
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import ModalLogin from './ModalLogin';
import NotificationButton from './NotificationButton';
import Notifications from './Notifications';
import ChatPage from './ChatPage';

function mapStateToProps(state) {
  return {action: state.action, name: state.name};
}

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () =>
      dispatch({
        type: 'OPEN_MENU',
      }),
    openLogin: () =>
      dispatch({
        type: 'OPEN_LOGIN',
      }),
    openNotif: () =>
      dispatch({
        type: 'OPEN_NOTIF',
      }),
  };
}

class Home extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    pan: new Animated.ValueXY(),
    myButton: null,
  };

  componentDidUpdate() {
    this.toggleMenu();
  }

  componentDidMount() {
    //this.props.openLogin();
    //this.myButton.props.onPress();
  }
  toggleMenu = () => {
    if (this.props.action == 'openMenu') {
      Animated.parallel([
        Animated.timing(this.state.scale, {
          toValue: 0.9,
          duration: 300,
          easing: Easing.in(),
          useNativeDriver: true,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (this.props.action == 'closeMenu') {
      Animated.parallel([
        Animated.timing(this.state.scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  handleAvatar() {
    console.log('yeah');
    if (this.props.name) {
      this.props.openMenu();
    } else {
      console.log('yes');
      this.props.openLogin();
    }
  }

  render() {
    return (
      <RootView>
        <Menu />

        <Notifications />
        <AnimatedContainer>
          <TitleBar>
            <TouchableOpacity
              onPress={() => {
                this.handleAvatar();
              }}
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
              }}>
              <Avatar source={require('../Images/avatar.jpg')} />
            </TouchableOpacity>

            <Title> Bonjour ! </Title>
            <Text>{this.props.name}</Text>
            <TouchableOpacity
              onPress={() => {
                if (this.props.name != null) {
                  return this.props.openNotif();
                } else {
                  Alert.alert(
                    "Veuillez vous connecter afin d'accéder au chat !",
                  );
                }
              }}
              style={{position: 'absolute', right: 20, top: 5}}>
              <NotificationButton />
            </TouchableOpacity>
          </TitleBar>

          <Animated.View>
            <Card />
          </Animated.View>
        </AnimatedContainer>

        <ModalLogin />
      </RootView>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

const RootView = styled.View`
  background: white;
  flex: 1;
`;

const Container = styled.View``;
const AnimatedContainer = Animated.createAnimatedComponent(Container);
const TitleBar = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-left: 80px;
`;
const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  background: black;
  border-radius: 22px;
  margin-left: 20px;
  position: relative;
  top: 0;
  left: 0;
`;
const Title = styled.Text`
  font-size: 16px;
  color: #b8bece;
  font-weight: 500;
`;

const Text = styled.Text`
  font-size: 20px;
  color: #3c4560;
  font-weight: bold;
`;
