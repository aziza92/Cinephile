import React from 'react';
import {StyleSheet, View} from 'react-native';
import FilmList from './FilmList';
import {connect} from 'react-redux';

import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi';
class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.search = '';
    this.page = 0;
    this.totalPages = 0;
    this.state = {
      films: [],
    };
    this._favFilm = this._favFilm.bind(this);
  }
  _favFilm() {
    getFilmsFromApiWithSearchedText(this.search, this.page + 1).then(data => {
      this.page = data.page;
      this.totalPages = data.total_pages;
      this.setState({
        films: [...this.state.films, ...data.results],
        isLoading: false,
      });
    });
  }

  _searchFilms() {
    this.page = 0;
    this.totalPages = 0;
    this.setState({
      films: [],
    });
    this._favFilm();
  }
  _searchTextInputChanged(text) {
    this.search = text;
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.avatar_container}></View>
        <View style={styles.main}>
          <View style={styles.main_text}></View>
        </View>
        <View></View>
        <FilmList
          data={this.state.films}
          films={this.props.favoritesFilm}
          navigation={this.props.navigation}
          favFilm={this._favFilm}
          favoriteList={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5,
  },
  avatar_container: {
    alignItems: 'center',
    marginTop: 40,
  },
  main: {
    flexDirection: 'row',
    margin: 5,
  },
  main_text: {
    flex: 1,
  },
  image: {
    width: 35,
    height: 35,
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  return {
    favoritesFilm: state.favoritesFilm,
  };
}
export default connect(mapStateToProps)(Favorites);
