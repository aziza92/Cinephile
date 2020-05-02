import React from 'react';
import {StyleSheet, View, Button, ActivityIndicator} from 'react-native';
import FilmVus from './FilmVus';
import {connect} from 'react-redux';

class Vus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      isLoading: false,
    };
  }

  _displayLoading() {
    if (this.state.isLoading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  render() {
    return (
      <FilmVus films={this.props.vusFilm} navigation={this.props.navigation} />
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollview_container: {
    flex: 1,
  },
  image: {
    height: 169,
    margin: 5,
  },
});
function mapStateToProps(state) {
  return {
    vusFilm: state.vusFilm,
  };
}

export default connect(mapStateToProps)(Vus);
