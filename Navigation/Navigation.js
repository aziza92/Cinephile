import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Home from '../Components/Home';
import Search from '../Components/Search';
import FilmDetail from '../Components/FilmDetail';
import Favorites from '../Components/Favorites';
import News from '../Components/News';
import Vus from '../Components/Vus';

const HomeStack = createStackNavigator(
  {
    Home: Home,
  },
  {
    mode: 'modal',
  },
);
const SearchStackNavigator = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Rechercher',
    },
  },
  FilmDetail: {
    screen: FilmDetail,
  },
});
const FavoritesStackNavigator = createStackNavigator({
  Favorites: {
    screen: Favorites,
    navigationOptions: {
      title: 'Favoris',
    },
  },
  FilmDetail: {
    screen: FilmDetail,
  },
});
const NewsStackNavigator = createStackNavigator({
  News: {
    screen: News,
    navigationOptions: {
      title: 'Les Derniers Films',
    },
  },
  FilmDetail: {
    screen: FilmDetail,
  },
});
const VusStackNavigator = createStackNavigator({
  Vus: {
    screen: Vus,
    navigationOptions: {
      title: 'Mes Films Vus',
    },
  },
  FilmDetail: {
    screen: FilmDetail,
  },
});

const MoviesTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: () => {
          // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return (
            <Image source={require('../Images/home.png')} style={styles.icon} />
          ); // On applique un style pour les redimensionner comme il faut
        },
      },
    },

    Search: {
      screen: SearchStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return (
            <Image
              source={require('../Images/ic_search.png')}
              style={styles.icon}
            />
          ); // On applique un style pour les redimensionner comme il faut
        },
      },
    },
    Favorites: {
      screen: Favorites,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require('../Images/ic_favorite.png')}
              style={styles.icon}
            />
          );
        },
      },
    },
    News: {
      screen: NewsStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require('../Images/ic_fiber_new.png')}
              style={styles.icon}
            />
          );
        },
      },
    },
    Vus: {
      screen: VusStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return (
            <Image
              source={require('../Images/ic_vus.png')}
              style={styles.icon}
            />
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
      inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
      showLabel: false, // On masque les titres
      showIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
    },
  },
);

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});

export default createAppContainer(MoviesTabNavigator);
