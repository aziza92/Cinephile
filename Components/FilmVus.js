import React from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import FilmImage from './FilmImage';
import {connect} from 'react-redux';

class FilmVus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
    };
  }

  _displayDetailForFilm = idFilm => {
    console.log('Display film ' + idFilm);
    // On a récupéré les informations de la navigation, on peut afficher le détail du film
    this.props.navigation.navigate('FilmDetail', {idFilm: idFilm});
  };

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.films}
        extraData={this.props.vusFilm}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <FilmImage
            film={item}
            isFilmvus={
              this.props.vusFilm.findIndex(film => film.id === item.id) !== -1
                ? true
                : false
            }
            displayDetailForFilm={this._displayDetailForFilm}
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (this.props.page < this.props.totalPages) {
            // On appelle la méthode loadFilm du component Search pour charger plus de films
            this.props.loadFilms();
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

function mapStateToProps(state) {
  return {
    vusFilm: state.vusFilm,
  };
}

export default connect(mapStateToProps)(FilmVus);
