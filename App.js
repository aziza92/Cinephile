import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/es/integration/react';
import AsyncStorage from '@react-native-community/async-storage';
import Navigation from './Navigation/Navigation';

const initialState = {
  action: '',
  name: '',
  avatar: '',
  favoritesFilm: [],
  vusFilm: [],
  posts: [],
};
const reducer = (state = initialState, action) => {
  let nextState;
  switch (action.type) {
    case 'OPEN_MENU':
      return {...state, action: 'openMenu'};
    case 'CLOSE_MENU':
      return {...state, action: 'closeMenu'};
    case 'UPDATE_NAME':
      return {...state, name: action.name};
    case 'OPEN_CARD':
      return {...state, action: 'openCard'};
    case 'CLOSE_CARD':
      return {...state, action: 'closeCard'};
    case 'OPEN_LOGIN':
      return {...state, action: 'openLogin'};
    case 'CLOSE_LOGIN':
      return {...state, action: 'closeLogin'};
    case 'OPEN_NOTIF':
      return {...state, action: 'openNotif'};
    case 'CLOSE_NOTIF':
      return {...state, action: 'closeNotif'};
    case 'SAVEPOSTS':
      return {...state, action: 'savePosts'};
    case 'NONVU':
      return {...state, action: 'nonVu'};
    case 'DEJAVU':
      return {...state, action: 'dejàVu'};

    case 'TOGGLE_FAVORITE':
      const favoriteFilmIndex = state.favoritesFilm.findIndex(
        item => item.id === action.value.id,
      );
      if (favoriteFilmIndex !== -1) {
        nextState = {
          ...state,
          favoritesFilm: state.favoritesFilm.filter(
            (item, index) => index !== favoriteFilmIndex,
          ),
        };
      } else {
        // Le film n'est pas dans les films favoris, on l'ajoute à la liste
        nextState = {
          ...state,
          favoritesFilm: [...state.favoritesFilm, action.value],
        };
      }
      return nextState || state;

    case 'TOGGLE_VUS':
      const vusFilmIndex = state.vusFilm.findIndex(
        item => item.id === action.value.id,
      );
      if (vusFilmIndex !== -1) {
        nextState = {
          ...state,
          vusFilm: state.vusFilm.filter(
            (item, index) => index !== vusFilmIndex,
          ),
        };
      } else {
        nextState = {
          ...state,
          vusFilm: [...state.vusFilm, action.value],
        };
      }
      return nextState || state;

    default:
      return state;
  }
};
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

function App() {
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
}

export default App;
