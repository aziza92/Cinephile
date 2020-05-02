import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import FilmList from './FilmList';
import {
  getFilmsFromApiWithSearchedText,
  getFilmsSortedByGenreActionFromApi,
  getFilmsSortedByGenreHorrorFromApi,
} from '../API/TMDBApi';
import {connect} from 'react-redux';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = '';
    this.page = 0;
    this.totalPages = 0;
    press = false;
    press2 = false;
    this.state = {
      films: [],
      isLoading: false,
      uri: require('../Images/action.png'),
    };

    (this._loadFilms = this._loadFilms.bind(this)),
      (this._actionGenre = this._actionGenre.bind(this)),
      (this._horrorGenre = this._horrorGenre.bind(this));
  }

  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({isLoading: true});
      getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(
        data => {
          this.page = data.page;
          this.totalPages = data.total_pages;
          this.setState({
            films: [...this.state.films, ...data.results],
            isLoading: false,
          });
        },
      );
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text;
  }

  _searchFilms() {
    this.page = 0;
    this.totalPages = 0;
    this.setState(
      {
        films: [],
      },
      () => {
        this._loadFilms();
      },
    );
  }

  _displayDetailForFilm = idFilm => {
    console.log('Display film with id ' + idFilm);
    this.props.navigation.navigate('FilmDetail', {idFilm: idFilm});
  };

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
  _actionGenre() {
    getFilmsSortedByGenreActionFromApi(this.page + 1).then(data => {
      this.page = data.page;
      this.totalPages = data.total_pages;
      this.setState({
        films: [...this.state.films, ...data.results],
      });
    });
  }
  _horrorGenre() {
    getFilmsSortedByGenreHorrorFromApi(this.page + 1).then(data => {
      this.page = data.page;
      this.totalPages = data.total_pages;
      this.setState({
        films: [...this.state.films, ...data.results],
      });
    });
  }

  _onPressImage() {
    if (press == false) {
      this.setState({
        films: [],
        uri: require('../Images/horror.png'),
      }),
        (press = true),
        this._horrorGenre();
    } else {
      this.setState({
        films: [],
        uri: require('../Images/action.png'),
      }),
        (press = false),
        this._actionGenre();
    }
  }
  render() {
    console.log('TEST');
    return (
      <View style={styles.main_container}>
        <View style={styles.main}>
          <View style={styles.main_text}>
            <TextInput
              style={styles.textinput}
              placeholder="Titre du film"
              onChangeText={text => this._searchTextInputChanged(text)}
              onSubmitEditing={() => this._searchFilms()}
            />
          </View>

          <TouchableOpacity onPress={() => this._onPressImage()}>
            <Image style={styles.image} source={this.state.uri} />
          </TouchableOpacity>
        </View>

        <Button title="Rechercher" onPress={() => this._searchFilms()} />
        <FilmList
          films={this.state.films}
          navigation={this.props.navigation}
          loadFilms={this._loadFilms}
          actionGenre={this._actionGenre}
          horrorGenre={this._horrorGenre}
          page={this.page}
          totalPages={this.totalPages}
          favoriteList={false}
        />
        {this._displayLoading()}
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
    borderColor: '#e2e2e2',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 5,
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flexDirection: 'row',
    margin: 5,
  },
  main_text: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
  },
  images: {
    width: 35,
    height: 35,
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  return {favoritesFilm: state.favoritesFilm};
}

export default connect(mapStateToProps)(Search);
