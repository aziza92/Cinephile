import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {closeLogin, updateName} from '../redux/actionsFile';
import database from '@react-native-firebase/database';
import {BlurView} from '@react-native-community/blur';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import styled from 'styled-components/native';
import Success from './Success';
import Loading from './Loading';

const screenHeight = Dimensions.get('window').height;

export default function ModalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [find, setFind] = useState(false);
  const [length, setLength] = useState(0);
  const [newCreate, setNewCreate] = useState(false);
  const [iconEmail, setIconEmail] = useState(
    require('../Images/icon-email.png'),
  );
  const [iconPassword, setIconPassword] = useState(
    require('../Images/icon-password.png'),
  );

  const [iconName, setIconName] = useState(require('../Images/name.png'));
  const [isSuccessful, setSuccessful] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const action = useSelector((state) => state.actions.action);
  const dispatch = useDispatch();

  useEffect(() => {
    const retrieveName = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        if (name !== null) {
          dispatch(updateName(name));
        }
      } catch (error) {}
    };
    retrieveName();
  }, []);

  useEffect(() => {
    if (action === 'openLogin') {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();
    }

    if (action === 'closeLogin') {
      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(scale, {toValue: 1.3, useNativeDriver: true}).start();
      }, 500);
    }
  }, [action]);

  // Storage Name
  const storeName = async (name) => {
    try {
      await AsyncStorage.setItem('name', name);
    } catch (error) {}
  };

  // LogIn :::::
  const handleLogin = () => {

    if (pseudo && email && password) {
      let user_pseudo = database().ref('/users');
      user_pseudo.once('value').then((snapshot) => {
        setLength(snapshot.numChildren());

        console.log(snapshot.numChildren())

        let userFound = false; //  track if user is found
        console.log("user Found", userFound )


        snapshot.forEach((el) => {
          if (
            pseudo === el.val().username &&
            email.toLowerCase() === el.val().email
          ) {
            setFind(true);
            setLoading(true);
            auth()
              .signInWithEmailAndPassword(email, password)
              .then((response) => {
                setLoading(false);
                setFind(false);
                if (response) {
                  setSuccessful(true);
                  storeName(pseudo);
                  dispatch(updateName(pseudo));
                  setTimeout(() => {
                    Keyboard.dismiss();
                    dispatch(closeLogin());
                    setSuccessful(false);
                  }, 1000);
                }
              })
              .catch((error) => {
                setLoading(false);
                setSuccessful(false);
                Alert.alert('Error', error.message);
                console.log('Error login', error);
              });

            userFound = true; // Set the flag to true when user is found
            return; // Exit the loop since the user is found
          }
        });

        // Check the flag and call handleSingin() only if user is not found
        if (!userFound) {
          console.log("cc")
          handleSingin();
        }

        if (find && newCreate) {
          Alert.alert('Aucun pseudo ne correspond à cette adresse email!');
        }
      });
    } else {
      console.log('erreur null');
      Alert.alert(
        'Error',
        "Veuillez remplir le pseudo, l'email et le mot de passe svp!",
      );
    }
  };

  // SigIn :::
  const handleSingin = () => {

    console.log("sigin")
    if (pseudo && email && password) {
      let rootRef = database().ref();
      rootRef
        .child('users')
        .orderByChild('username')
        .equalTo(pseudo)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            let userData = snapshot.val();

            Alert.alert('Ce pseudo est dejà utilisé ! ');
          } else {
            setLoading(true);
            auth()
              .createUserWithEmailAndPassword(email, password)
              .then((response) => {
                const uid = auth().currentUser.uid;
                const username = pseudo;
                const password = password;
                const email = auth().currentUser.email;

                database()
                  .ref('users/' + uid)
                  .set({
                    uid,
                    username,
                    email,
                    password,
                  });

                setLoading(false);
                if (response) {
                  setSuccessful(true);
                  dispatch(updateName(pseudo));
                  setTimeout(() => {
                    Keyboard.dismiss();
                    dispatch(closeLogin());
                    setSuccessful(false);
                  }, 1000);
                }
              })
              .catch(function (error) {
                setLoading(false);
                setSuccessful(false);
                Alert.alert('Error', error.message);
                console.log(error.message);
              });
            setNewCreate(false);
          }
        });
    } else {
      console.log('erreur null');
      Alert.alert(
        'Error',
        "veuillez remplir le pseudo,l'email et le password svp!",
      );
    }
  };

  // change the image on tape
  const focusName = () => {
    setIconName(require('../Images/nameB.png'));
    setIconEmail(require('../Images/icon-email.png'));
    setIconPassword(require('../Images/icon-password.png'));
  };

  const focusEmail = () => {
    setIconName(require('../Images/name.png'));
    setIconEmail(require('../Images/icon-email-animated.gif'));
    setIconPassword(require('../Images/icon-password.png'));
  };
  const focusPassword = () => {
    setIconName(require('../Images/name.png'));
    setIconEmail(require('../Images/icon-email.png'));
    setIconPassword(require('../Images/icon-password-animated.gif'));
  };

  const tapBackground = () => {
    Keyboard.dismiss();
    dispatch(closeLogin());
  };

  return (
    <AnimatedContainer style={{transform: [{translateY}, {scale}]}}>
      <TouchableWithoutFeedback onPress={tapBackground}>
        <BlurView
          tint="default"
          intensity={100}
          style={{position: 'absolute', width: '100%', height: '100%'}}
        />
      </TouchableWithoutFeedback>

      <AnimatedModal
        style={{
          transform: [{scale: scale}, {translateY: translateY}],
        }}>
        <Logo source={require('../Images/Film.png')} />
        <Text>Passion Cinéphile</Text>

        <TextInput
          onChangeText={(pseudo) => setPseudo(pseudo)}
          placeholder="Pseudo"
          value={pseudo}
          onFocus={focusName}
        />
        <TextInput
          onChangeText={(email) => setEmail(email)}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onFocus={focusEmail}
        />
        <TextInput
          onChangeText={(password) => setPassword(password)}
          placeholder="Mot de passe"
          value={password}
          secureTextEntry={true}
          onFocus={focusPassword}
        />
        <IconName source={iconName} />
        <IconEmail source={iconEmail} />
        <IconPassword source={iconPassword} />
        <TouchableOpacity onPress={handleLogin}>
          <ButtonView>
            <ButtonText>Se connecter</ButtonText>
          </ButtonView>
        </TouchableOpacity>
      </AnimatedModal>

      {/*Lottie Animation */}
      <Success isActive={isSuccessful} />
      <Loading isActive={isLoading} />
      {/*Lottie Animation */}
    </AnimatedContainer>
  );
}

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
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
