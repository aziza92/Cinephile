import {firebase} from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBday0Ltcbc7glXND--sqc7jyvfreMd-lE',
  authDomain: 'Cinephile.firebaseapp.com',
  databaseURL: 'https://cinephile-dba20.firebaseio.com/',
  projectId: 'cinephile-dba20',
  storageBucket: 'cinephile-dba20.appspot.com',
  messagingSenderId: '938783294634',
  appId: '1:938783294634:android:840021eda44b5a2ed57cd3',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    //
  } else {
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        alert(error.message);
      });
  }
});

export default firebase;
