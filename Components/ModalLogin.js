import React from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {connect} from 'react-redux';
import Success from './Success';
import Loading from './Loading';
import firebase from './Firebase';
import AsyncStorage from '@react-native-community/async-storage';
import database from '@react-native-firebase/database';

const screenHeight = Dimensions.get('window').height;

function mapStateToProps(state) {
  return {action: state.action};
}

function mapDispatchToProps(dispatch) {
  return {
    closeLogin: () =>
      dispatch({
        type: 'CLOSE_LOGIN',
      }),
    //redux "email"
    updateName: name =>
      dispatch({
        type: 'UPDATE_NAME',
        name,
      }),
  };
}

class ModalLogin extends React.Component {
  state = {
    email: '',
    password: '',
    pseudo: '',
    items: [],
    find: false,
    length: 0,
    counter: 0,
    newcreate: false,
    iconEmail: require('../Images/icon-email.png'),
    iconPassword: require('../Images/icon-password.png'),
    iconName: require('../Images/name.png'),
    isSuccessful: false,
    isLoading: false,
    scale: new Animated.Value(1),
    translateY: new Animated.Value(0),
    top: new Animated.Value(screenHeight),
  };

  // appel pour storage
  componentDidMount() {
    this.retrieveName();
  }

  componentDidUpdate() {
    if (this.props.action == 'openLogin') {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: 0,
      }).start();
      Animated.spring(this.state.scale, {toValue: 1}).start();
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: 0,
      }).start();
    }

    if (this.props.action == 'closeLogin') {
      setTimeout(() => {
        Animated.timing(this.state.top, {
          toValue: screenHeight,
          duration: 0,
        }).start();
        Animated.spring(this.state.scale, {toValue: 1.3}).start();
      }, 500);

      Animated.timing(this.state.translateY, {
        toValue: 1000,
        duration: 500,
      }).start();
    }
  }

  // Storage
  storeName = async name => {
    try {
      await AsyncStorage.setItem('name', name);
    } catch (error) {}
  };
  retrieveName = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      if (name !== null) {
        //console.log(name);
        this.props.updateName(name);
      }
    } catch (error) {}
  };
  //

  handleLogin = () => {
    const email = this.state.email;
    const password = this.state.password;
    const pseudo = this.state.pseudo;
    this.state.length = 0;
    this.state.counter = 0;

    if ((pseudo != '') & (email != '') & (password != '')) {
      let user_pseudo = firebase.database().ref('/users');
      user_pseudo.once('value').then(snapshot => {
        this.state.length = snapshot.numChildren();
        snapshot.forEach(el => {
          if (
            pseudo !== el.val().username &&
            email.toLowerCase() !== el.val().email
          ) {
            this.state.counter = this.state.counter + 1;
          }

          if (
            pseudo === el.val().username &&
            email.toLowerCase() === el.val().email
          ) {
            this.state.find = true;
            this.state.isLoading = true;
            this.setState({find: true, isLoading: true}, () => {
              firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .catch(error => {
                  if (error.code === 'auth/user-not-found') {
                    //Alert.alert('sakhta');
                    this.handleSingin().bind(this);
                  } else Alert.alert('Error', error.message);
                })
                .then(response => {
                  this.setState({isLoading: false});
                  this.state.find = false;
                  if (response) {
                    // Successful
                    this.setState({
                      isSuccessful: true,
                    });
                    //storage

                    this.storeName(this.state.pseudo);
                    //this.fetchUser();
                    this.props.updateName(this.state.pseudo);

                    setTimeout(() => {
                      Keyboard.dismiss();
                      this.props.closeLogin();
                      this.setState({
                        isSuccessful: false,
                      });
                    }, 1000);
                  }
                });
            });
          }
        });
        //console.log('premier pseudo' + this.state.pseudo);
        /*console.log(
          'find=' + this.state.find + 'newcreate=' + this.state.newcreate,
          'counter=' + this.state.counter + 'length=' + this.state.length,
        );*/

        if (this.state.counter == this.state.length) {
          this.handleSingin();
        }
        if (this.state.find == false && this.state.newcreate == false) {
          Alert.alert('Aucun pseudo ne correspond à cette adresse email!');
          console.log(
            'find2=' + this.state.find + 'newcreate2=' + this.state.newcreate,
            'counter2=' + this.state.counter + 'length=' + this.state.length,
          );
        }
      });
    } else {
      console.log('erreur null');
      Alert.alert(
        'Error',
        "veuillez remplir le pseudo, l'email et le password svp!",
      );
    }
  };

  handleSingin() {
    const email = this.state.email;
    const password = this.state.password;
    const pseudo = this.state.pseudo;
    this.state.newcreate = true;
    if ((pseudo != '') & (email != '') & (password != '')) {
      let rootRef = firebase.database().ref();
      rootRef
        .child('users')
        .orderByChild('username')
        .equalTo(pseudo)
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            let userData = snapshot.val();
            //console.log(userData);
            Alert.alert('Ce pseudo est dejà utilisé ! ');
          } else {
            this.setState({isLoading: true});
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .catch(function(error) {
                Alert.alert('Error', error.message);
              })

              .then(response => {
                const uid = firebase.auth().currentUser.uid;
                const username = this.state.pseudo;
                const password = this.state.password;
                const email = firebase.auth().currentUser.email;

                firebase
                  .database()
                  .ref('users/' + uid)
                  .set({
                    uid,
                    username,
                    email,
                    password,
                  });

                console.log(response);
                this.setState({isLoading: false});
                if (response) {
                  this.setState({isSuccessful: true});
                  this.props.updateName(this.state.pseudo);
                  setTimeout(() => {
                    Keyboard.dismiss();
                    this.props.closeLogin();
                    this.setState({isSuccessful: false});
                  }, 1000);
                }
              });
            this.state.newcreate = false;
          }
        });
    } else {
      console.log('erreur null');
      Alert.alert(
        'Error',
        "veuillez remplir le pseudo,l'email et le password svp!",
      );
    }
  }

  // change the image on tape

  focusName = () => {
    this.setState({
      iconName: require('../Images/nameB.png'),
      iconEmail: require('../Images/icon-email.png'),
      iconPassword: require('../Images/icon-password.png'),
    });
  };
  focusEmail = () => {
    this.setState({
      iconName: require('../Images/name.png'),
      iconEmail: require('../Images/icon-email-animated.gif'),
      iconPassword: require('../Images/icon-password.png'),
    });
  };

  focusPassword = () => {
    this.setState({
      iconName: require('../Images/name.png'),
      iconEmail: require('../Images/icon-email.png'),
      iconPassword: require('../Images/icon-password-animated.gif'),
    });
  };
  tapBackground = () => {
    Keyboard.dismiss();
    this.props.closeLogin();
  };

  render() {
    //console.log(this.state.user);
    return (
      <AnimatedContainer style={{top: this.state.top}}>
        <TouchableWithoutFeedback onPress={this.tapBackground}>
          <BlurView
            tint="default"
            intensity={100}
            style={{position: 'absolute', width: '100%', height: '100%'}}
          />
        </TouchableWithoutFeedback>

        <AnimatedModal
          style={{
            transform: [
              {scale: this.state.scale},
              {translateY: this.state.translateY},
            ],
          }}>
          <Logo source={require('../Images/Film.png')} />
          <Text>Passion Cinéphile</Text>

          <TextInput
            onChangeText={pseudo => this.setState({pseudo})}
            placeholder="Pseudo"
            value={this.state.pseudo}
            onFocus={this.focusName}
          />
          <TextInput
            onChangeText={email => this.setState({email})}
            placeholder="Email"
            value={this.state.email}
            keyboardType="email-address"
            onFocus={this.focusEmail}
          />
          <TextInput
            onChangeText={password => this.setState({password})}
            placeholder="Mot de passe"
            value={this.state.password}
            secureTextEntry={true}
            onFocus={this.focusPassword}
          />
          <IconName source={this.state.iconName} />
          <IconEmail source={this.state.iconEmail} />
          <IconPassword source={this.state.iconPassword} />
          <TouchableOpacity onPress={this.handleLogin}>
            <ButtonView>
              <ButtonText>Se connecter</ButtonText>
            </ButtonView>
          </TouchableOpacity>
        </AnimatedModal>
        <Success isActive={this.state.isSuccessful} />
        <Loading isActive={this.state.isLoading} />
      </AnimatedContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalLogin);

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
`;
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const TextInput = styled.TextInput`
  border: 1px solid #dbdfea;
  width: 295px;
  height: 44px;
  border-radius: 10px;
  font-size: 17px;
  color: #3c4560;
  padding-left: 44px;
  margin-top: 20px;
`;

const Modal = styled.View`
  width: 335px;
  height: 370px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  align-items: center;
`;
const AnimatedModal = Animated.createAnimatedComponent(Modal);

const Logo = styled.Image`
  width: 44px;
  height: 44px;
  margin-top: 50px;
`;

const Text = styled.Text`
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  width: 160px;
  color: #b8bece;
  text-align: center;
`;

const ButtonView = styled.View`
  background: #5263ff;
  width: 295px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 10px 20px #c2cbff;
`;

const ButtonText = styled.Text`
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 20px;
`;

const Buttontext = styled.Text`
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 11px;
  margin-top: 0px;
`;
const Buttonview = styled.View`
  background: #5263ff;
  width: 100px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 0 10px 20px #c2cbff;
`;
const IconName = styled.Image`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 158px;
  left: 31px;
`;
const IconEmail = styled.Image`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 220px;
  left: 30px;
`;

const IconPassword = styled.Image`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 286px;
  left: 30px;
`;
