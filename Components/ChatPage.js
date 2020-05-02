import React from 'react';
import {KeyboardAvoidingView, Alert} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firebase from './Firebase';

class ChatPage extends React.Component {
  state = {
    pseudo: '',
    user2: '',
    messages: [],
    messagesRef: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var user = user.uid;
        this.setState({
          user2: user,
        });
        //Alert.alert('uid=' + uid);
        firebase
          .database()
          .ref('/users/' + user)
          .child('username')
          .once('value', snapshot => {
            //console.log(snapshot.val());
            let data = snapshot.val();
            //console.log(this.state.pseudo);
            this.setState({
              pseudo: data,
            });
          });
      } else {
        // changer le state du pseudo
        //Alert.alert('IS ANONYMOUS');
      }
    });
    this.loadMessages(message => {
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }

  getLimit() {
    var today = new Date();
    today.setDate(today.getDate() - 31); // last 30 Days
    //console.log(today);
    var changedISODate = new Date(today).toISOString();
    //console.log(changedISODate);
    return changedISODate;
  }
  loadMessages(callback) {
    this.messagesRef = firebase.database().ref('/messages');
    this.messagesRef.off();

    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        //createdAt: new Date(message.createdAt),
        createdAt: new Date(),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
      //console.log(JSON.stringify(message));
      //console.log('this' + message.user._id);
    };
    var d = this.getLimit();
    this.messagesRef.limitToLast(10).on('child_added', onReceive);
    //this.messagesRef.orderByChild('createdAt').on('child_added', onReceive);
  }
  sendMessage(message) {
    //Alert.alert('currentUser=' + JSON.stringify(firebase.auth().currentUser));

    var today = new Date();
    var timestamp = today.toISOString();
    for (let i = 0; i < message.length; i++) {
      this.messagesRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: timestamp,
      });
      //console.log('this' + firebase.auth().currentUser.uid);
    }
  }

  render() {
    //console.log('heycccc' + this.state.pseudo);

    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => 100,
        })()}>
        <GiftedChat
          messages={this.state.messages}
          onSend={message => this.sendMessage(message)}
          user={{_id: this.state.user2, name: this.state.pseudo}}
          renderUsernameOnMessage={true}
        />
      </KeyboardAvoidingView>
    );
  }
}
export default ChatPage;
