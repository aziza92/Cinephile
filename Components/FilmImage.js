import React from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {getImageFromApi} from '../API/TMDBApi';
import moment from 'moment';

class FilmImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      TextHolder: this.props.film.title,
      instance: false,
      sortie: moment(new Date(this.props.film.release_date)).format(
        'DD/MM/YYYY',
      ),
    };
  }

  _onLongPressButton = () => {
    if (this.state.instance == false) {
      this.setState({
        TextHolder: 'sorti le ' + this.state.sortie,
      });
      this.state.instance = !this.state.instance;
    } else {
      this.state.instance = !this.state.instance;
      this.setState({
        TextHolder: this.props.film.title,
      });
    }
  };

  render() {
    const {film, displayDetailForFilm} = this.props;
    return (
      <TouchableOpacity
        onLongPress={this._onLongPressButton}
        style={styles.main_container}
        onPress={() => displayDetailForFilm(film.id)}>
        <Image
          style={styles.image}
          source={{uri: getImageFromApi(film.poster_path)}}
        />
        <View style={styles.content_container}>
          <View style={styles.header_container}>
            <Text style={styles.title_text}>{this.state.TextHolder}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 120,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 200 / 2,
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
  date_text: {
    textAlign: 'right',
    fontSize: 14,
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
});

export default FilmImage;
