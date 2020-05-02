import React from 'react';
import styled from 'styled-components';
import {Image, View, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import firebase from './Firebase';
import ChatPage from './ChatPage';

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

class MenuItem extends React.Component {
  handleMenu = () => {
    var user = firebase.auth().currentUser;
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });

    this.props.closeMenu();
    this.props.updateName();

    AsyncStorage.clear();
  };

  render() {
    return (
      <Container>
        <IconView>
          <Image
            source={require('../Images/account.png')}
            size={24}
            color="#546bfb"
          />
          <IconView>
            <Image
              source={require('../Images/Logout.png')}
              size={24}
              color="#546bfb"
            />
          </IconView>
        </IconView>
        <Content>
          <Title>Account</Title>
          <Text>Settings</Text>
          <Content>
            <TouchableOpacity
              onPress={() => {
                this.handleMenu();
              }}>
              <Title> Log out</Title>
              <Text> See you soon!</Text>
            </TouchableOpacity>
          </Content>
        </Content>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuItem);

const Container = styled.View`
  flex-direction: row;
  margin: 20px 0;
  margin-top: 45px;
  height: 40px;
`;

const IconView = styled.View`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  margin-top: 55px;
`;

const Content = styled.View`
  height: 200px;
  padding: 10px;
  align-items: center;
  margin-top: 5px;
`;

const Title = styled.Text`
  color: #3c4560;
  font-size: 24px;
  font-weight: 600;
`;

const Text = styled.Text`
  color: #3c4560;
  font-weight: 600;
  opacity: 0.6;
  margin-top: 5px;
`;
