// Components/FilmItem.js

import React from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {getImageFromApi} from '../API/TMDBApi';
import FadeIn from '../Animations/FadeIn';
import moment from 'moment';
import GetPosts from './GetPosts';

class FilmItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
    };
  }
  _displayFavoriteImage() {
    if (this.props.isFilmFavorite) {
      // Si la props isFilmFavorite vaut true, on affiche le 🖤
      return (
        <Image
          style={styles.favorite_image}
          source={require('../Images/ic_favorite.png')}
        />
      );
    }
  }

  render() {
    const {film, displayDetailForFilm} = this.props;

    return (
      <FadeIn>
        <TouchableOpacity
          style={styles.main_container}
          onPress={() => displayDetailForFilm(film.id)}>
          {film.backdrop_path != null ? (
            <Image
              style={styles.image}
              source={{uri: getImageFromApi(film.backdrop_path)}}
            />
          ) : (
            <Image
              style={styles.image}
              source={require('./Film-Affiche.png')}
            />
          )}
          <View style={styles.content_container}>
            <View style={styles.header_container}>
              {this._displayFavoriteImage()}
              <Text style={styles.title_text}>{film.title}</Text>
              <Text style={styles.vote_text}>{film.vote_average}</Text>
            </View>
            <View style={styles.description_container}>
              <Text style={styles.description_text} numberOfLines={6}>
                {film.overview}
              </Text>
            </View>
            <View style={styles.date_container}>
              {film.release_date != '' ? (
                <Text style={styles.date_text}>
                  Sorti le{' '}
                  {moment(new Date(film.release_date)).format('DD/MM/YYYY')}
                </Text>
              ) : (
                <Text style={styles.date_text}>date de sortie inconnue</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </FadeIn>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 180,
    margin: 5,
  },
  content_container: {
    flex: 1,
    margin: 5,
  },
  header_container: {
    flex: 3,
    flexDirection: 'row',
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5,
  },
  vote_text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666',
  },
  description_container: {
    flex: 7,
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
  },
  date_container: {
    flex: 1,
  },
  date_text: {
    textAlign: 'right',
    fontSize: 14,
  },
  favorite_image: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
});

export default FilmItem;
