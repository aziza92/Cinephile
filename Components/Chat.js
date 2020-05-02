import React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firebase from './Firebase';

class Chat extends React.Component {
  state = {
    messages: [],
    messagesRef: null,
  };

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    const name = firebase
      .database()
      .ref('/users/' + uid)
      .child('username')
      .on('value', snapshot => {
        //console.log(snapshot.val());
        let data = snapshot.val();
        //console.log(this.state.pseudo);
        this.setState({
          pseudo: data,
        });
      });
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hi there, how are you doing ?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'user1@gmail.com',
            avatar: 'https://placeimg.com/640/480/nature',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    firebase
      .database()
      .ref('/messages')
      .push({messages});
  }

  loadMessages(callback) {
    this.messagesRef = firebase.database().ref('/messages');
    this.messagesRef.off();

    const onReceive = data => {
      const messages = data.val();
      callback({
        _id: data.key,
        text: messages.text,
        //createdAt: new Date(message.createdAt),
        createdAt: messages.createdAt,
        user: {
          _id: messages.user._id,
          name: messages.user.name,
        },
      });
    };
    var d = this.getLimit();
    this.messagesRef.orderByChild('createdAt').on('child_added', onReceive);
  }
  getLimit() {
    var today = new Date();
    today.setDate(today.getDate() - 31); // last 30 Days
    //console.log(today);
    var changedISODate = new Date(today).toISOString();
    //console.log(changedISODate);
    return changedISODate;
  }

  render() {
    var d = this.getLimit();
    console.log('date :' + d);

    console.log('heycccc' + this.state.pseudo);

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
          onSend={messages => this.onSend(messages)}
          user={{name: this.state.pseudo}}
          renderUsernameOnMessage={true}
        />
      </KeyboardAvoidingView>
    );
  }
}
export default Chat;
