import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';

import firebase from './Firebase';

import database from '@react-native-firebase/database';

class NewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postStatus: null,
      postText: '',
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;

    firebase;
    database()
      .ref('users/' + uid)
      .child('username')
      .on('value', snapshot => {
        //console.log(snapshot.val());
        let data = snapshot.val();

        this.setState({
          pseudo: data,
        });
      });
  }

  _handleNewPost() {
    this.setState({
      postStatus: 'Posting...',
    });

    if (firebase.auth().currentUser.email != null) {
      if (this.state.postText.length > 15) {
        const time = Date.now();
        const uid = firebase.auth().currentUser.uid;
        const email = firebase.auth().currentUser.email;
        const name = this.state.pseudo;
        var value = this.props.value;

        const newPostKey = firebase
          .database()
          .ref()
          .child('posts')
          .push().key;

        const postData = {
          film_id: value,
          username: name,
          email: firebase.auth().currentUser.email,
          time: time,
          text: this.state.postText,
          puid: newPostKey,
        };
        let updates = {};
        updates['/posts/' + uid + newPostKey] = postData;
        //updates['/users/' + uid + '/posts/' + newPostKey] = postData;

        firebase
          .database()
          .ref()
          .update(updates)
          .then(() => {
            this.setState({postStatus: 'Posté! Merci.', postText: ''});
          })
          .catch(() => {
            this.setState({
              postStatus: 'Une erreur s' + 'est produite.Veuillez réessayer!!',
            });
          });
      } else {
        this.setState({
          postStatus: 'Vous devez poster au moins 15 caractères.',
        });
      }
    } else {
      this.setState({
        postStatus: 'Vous devez vous connecter!',
      });
    }

    setTimeout(() => {
      this.setState({postStatus: null});
    }, 2000);
  }

  render() {
    var value = this.props.value;
    console.log(value);
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            multiline={true}
            style={styles.inputField}
            underlineColorAndroid="transparent"
            placeholder="Votre commentaire..."
            value={this.state.postText}
            onChangeText={text => this.setState({postText: text})}
            placeholderTextColor="rgba(0,0,0,.6)"
          />
        </View>

        <TouchableOpacity
          style={styles.butnContainer}
          onPress={this._handleNewPost.bind(this)}>
          <Text style={styles.butnText}>Envoyer</Text>
        </TouchableOpacity>
        <Text style={styles.message}>{this.state.postStatus}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  message: {
    textAlign: 'left',

    paddingBottom: 0,
    color: '#FF6A6A',
  },
  inputContainer: {
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255,255,255,.6)',
    padding: 5,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 15,
  },
  inputField: {
    padding: 10,
    textAlignVertical: 'top',
  },
  butnContainer: {
    width: 80,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignSelf: 'flex-end',
  },
  butnText: {
    color: 'dodgerblue',
    fontSize: 12,
  },
});

export default NewPost;
