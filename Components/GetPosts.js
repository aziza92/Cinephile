import React from 'react';
import {
  Text,
  View,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import firebase from './Firebase';
import database from '@react-native-firebase/database';
import PostDesign from './PostDesign';
import {getFilmDetailFromApi} from '../API/TMDBApi';
import NewPost from './NewPost';

class GetPosts extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
  };
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      data2: [],
      posts: {},
      array: [],
      newArray: [],
      postsCount: 0,
    };
  }

  componentDidMount() {
    var f_id = this.props.identifier;

    firebase
      .database()
      .ref('/posts/')
      .orderByKey()
      .on('value', snapshot => {
        snapshot.forEach(el => {
          if (el.val().film_id == f_id) {
            this.state.data = [
              {
                email: el.val().email,
                puid: el.val().puid,
                username: el.val().username,
                time: el.val().time,
                text: el.val().text,
              },
            ];

            this.setState(prevState => ({
              data2: prevState.data2.concat(this.state.data),
              //postsCount: _.size(this.state.data2),
            }));
            //console.log('test' + i + '=' + JSON.stringify(this.state.data2));
          }
        });
        //Alert.alert('User data: ' + JSON.stringify(snapshot.val()));
        //Alert.alert(JSON.stringify(this.state.data2));
        this.state.data2.forEach(obj => {
          if (!this.state.newArray.some(o => o.puid === obj.puid)) {
            this.state.newArray.push({...obj});
          }
        });

        this.setState(prevState => ({
          posts: prevState.newArray,
          postsCount: _.size(prevState.newArray),
        }));
        console.log('valeur finale POSTS=' + this.state.posts);
      });
  }

  renderPosts() {
    const postArray = [];

    _.forEach(this.state.posts, (value, index) => {
      const time = value.time;
      const timeString = moment(time).fromNow();
      postArray.push(
        <TouchableOpacity
          onLongPress={this._handleDelete.bind(this, value.puid)}
          key={index}>
          <PostDesign
            posterName={value.username}
            postTime={timeString}
            postContent={value.text}
          />
        </TouchableOpacity>,
      );
      //console.log(postArray);
    });
    _.reverse(postArray);
    return postArray;
  }

  _handleDelete(puid) {
    console.log('PUID=' + puid);
    const email = firebase.auth().currentUser.email;
    let user_email = firebase.database().ref('/posts');

    user_email.once('value').then(snapshot => {
      snapshot.forEach(el => {
        console.log('Userdb :' + el.val().email);
        if (email === el.val().email && puid === el.val().puid) {
          console.log('EMAIL=' + email);
          console.log('ELEMENT_EMAIL=' + el.val().email);
          Alert.alert(
            'Supprimer le message',
            'Are you sure to delete the post?',
            [
              {text: 'Oui', onPress: () => this._deleteConfirmed(puid)},
              {text: 'Non'},
            ],
          );
          //console.log('Userdb :' + el.val().email);
        } else {
          //
          console.log('Usercur :' + email);
        }
      });
    });
  }
  _deleteConfirmed(puid) {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('/posts/' + uid + puid)
      .remove();
    //console.log('/posts/' + uid);
    this.setState(prevState => ({
      posts: prevState.newArray.filter(user => user.puid !== puid),
      newArray: prevState.newArray.filter(user => user.puid !== puid),
      data2: [],
    }));
  }

  render() {
    //console.log('apres avoir ecrit le msg' + this.state.posts);
    return (
      <View style={styles.container}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{this.props.email}</Text>
          </View>
          <View style={styles.profileCountsContainer}>
            <Text style={styles.profileCounts}>{this.state.postsCount}</Text>
            <Text style={styles.countsName}>POSTS</Text>
          </View>
        </View>

        <ScrollView styles={styles.postContainer}>
          {this.renderPosts()}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    height: 65,
    borderRadius: 20,
  },
  profileNameContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  profileName: {
    marginLeft: 20,

    fontSize: 20,
    color: '#ffffff',
  },
  profileCountsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCounts: {
    fontSize: 25,
    color: 'gray',
  },
  countsName: {
    fontSize: 12,
    color: 'gray',
  },
});

export default GetPosts;
