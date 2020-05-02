import React from 'react';
import {
  StyleSheet,
  Share,
  Platform,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getFilmDetailFromApi, getImageFromApi} from '../API/TMDBApi';
import moment from 'moment';
import numeral from 'numeral';
import {connect} from 'react-redux';
import EnlargeShrink from '../Animations/EnlargeShrink';
import {NativeModules} from 'react-native';
import NewPost from './NewPost';
import GetPosts from './GetPosts';

//if (__DEV__) {
// NativeModules.DevSettings.setIsDebuggingRemotely(true);
//}

class FilmDetail extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
    if (params.film != undefined && Platform.OS === 'ios') {
      return {
        // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
        headerRight: (
          <TouchableOpacity
            style={styles.share_touchable_headerrightbutton}
            onPress={() => params.shareFilm()}>
            <Image
              style={styles.share_image}
              source={require('../Images/ic_share.png')}
            />
          </TouchableOpacity>
        ),
      };
    }

    if (params.film != undefined && Platform.OS === 'android') {
      return {
        headerRight: (
          <TouchableOpacity
            style={styles.share_touchable_floatingactionbutton}
            onPress={() => params.shareFilm()}>
            <Image
              style={styles.share_image}
              source={require('../Images/ic_share.png')}
            />
          </TouchableOpacity>
        ),
      };
    }
  };

  constructor(props) {
    super(props);

    this.navigationWillFocusListener = props.navigation.addListener(
      'willFocus',
      () => {
        // do something like this.setState() to update your view
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(
          data => {
            this.setState(
              {
                film: data,
                isLoading: false,
              },
              () => {
                this._updateNavigationParams();
              },
            );
          },
        );
      },
    );

    this.state = {
      film: undefined,
      data: '',
      isLoading: false,
      toggle: false,
    };
    this._shareFilm = this._shareFilm.bind(this);
  }
  componentWillUnmount() {
    this.navigationWillFocusListener.remove();
  }

  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film,
    });
  }
  componentDidMount() {
    var data2 = this.props.navigation.state.params.idFilm;
    this.setState({
      data: data2,
    });
    console.log('rrrrrrr' + data2);

    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(
      item => item.id === this.props.navigation.state.params.idFilm,
    );
    if (favoriteFilmIndex !== -1) {
      // Film déjà dans nos favoris, on a déjà son détail
      // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
      this.setState(
        {
          film: this.props.favoritesFilm[favoriteFilmIndex],
        },
        () => {
          this._updateNavigationParams();
        },
      );
      return;
    }
    // Le film n'est pas dans nos favoris, on n'a pas son détail
    // On appelle l'API pour récupérer son détail
    this.setState({isLoading: true});
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(
      data => {
        this.setState(
          {
            film: data,
            isLoading: false,
          },
          () => {
            this._updateNavigationParams();
          },
        );
      },
    );
  }

  _shareFilm() {
    const {film} = this.state;
    Share.share({title: film.title, message: film.overview});
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.Loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  _toggleFavorite() {
    const action = {type: 'TOGGLE_FAVORITE', value: this.state.film};
    this.props.dispatch(action);
  }
  componentDidUpdate() {
    //console.log(this.props.favoritesFilm);
  }

  _displayFavoriteImage() {
    var sourceImage = require('../Images/ic_favorite_border.png');
    var shouldEnlarge = false; //si le film n'est pas en favoris on veut qu'au en clic sur le button, celui-ci s'agrandise => shouldEnlarge a true!
    if (
      this.props.favoritesFilm.findIndex(
        item => item.id === this.state.film.id,
      ) !== -1
    ) {
      // Film dans nos favoris
      sourceImage = require('../Images/ic_favorite.png');
      shouldEnlarge = true;
    }

    return (
      <EnlargeShrink shouldEnlarge={shouldEnlarge}>
        <Image style={styles.favorite_image} source={sourceImage} />
      </EnlargeShrink>
    );
  }
  _displayButtonVu() {
    var vu = 'Dejà Vu';

    if (
      this.props.vusFilm.findIndex(item => item.id === this.state.film.id) !==
      -1
    ) {
      // Film dans non vu
      var vu = 'Non vu';
    }

    return <Text style={styles.text}>{vu}</Text>;
  }

  _toggleVus() {
    const action = {type: 'TOGGLE_VUS', value: this.state.film};
    this.props.dispatch(action);

    const newState = !this.state.toggle;
    this.setState({toggle: newState});
  }

  _displayFilm() {
    const {film} = this.state;

    if (film != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
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

          <Text style={styles.title_text}>{film.title}</Text>

          <TouchableOpacity
            style={styles.Buttom}
            onPress={() => this._toggleVus()}>
            {this._displayButtonVu()}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favorite_container}
            onPress={() => this._toggleFavorite()}>
            {this._displayFavoriteImage()}
          </TouchableOpacity>

          <Text style={styles.description_text}>{film.overview}</Text>
          {film.release_date != '' ? (
            <Text style={styles.date_text}>
              {' '}
              Sorti le{' '}
              {moment(new Date(film.release_date)).format('DD/MM/YYYY')}
            </Text>
          ) : (
            <Text style={styles.date_text}> Date de sortie inconnue</Text>
          )}

          <Text style={styles.default_text}>
            Note : {film.vote_average} / 10
          </Text>
          <Text style={styles.default_text}>
            Nombre de votes : {film.vote_count}
          </Text>
          <Text style={styles.default_text}>
            Budget : {numeral(film.budget).format('0,0[.]00 $')}
          </Text>
          <Text style={styles.default_text}>
            Genre(s) :{' '}
            {film.genres
              .map(function(genre) {
                return genre.name;
              })
              .join(' / ')}
          </Text>
          <Text style={styles.default_text}>
            Companie(s) :{' '}
            {film.production_companies
              .map(function(company) {
                return company.name;
              })
              .join(' / ')}
          </Text>
          <GetPosts identifier={this.state.data} />
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayFilm()}
        {this._displayLoading()}

        <View>
          <NewPost value={this.state.data} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },

  Loading_container: {
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
  title_text: {
    fontWeight: 'bold',
    fontSize: 35,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center',
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
    margin: 5,
    marginBottom: 15,
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  favorite_container: {
    alignItems: 'center',
  },
  favorite_image: {
    flex: 1,
    width: null,
    height: null,
  },
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    right: 10,
    top: 3,
    width: 50,
    height: 50,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  share_image: {
    width: 30,
    height: 30,
  },
  share_touchable_headerrightbutton: {
    marginRight: 8,
  },
  Buttom: {
    padding: '2%',
    backgroundColor: 'black',
    maxWidth: 270,
    alignSelf: 'center',
    borderRadius: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white',
  },
});
function mapStateToProps(state) {
  return {
    favoritesFilm: state.favoritesFilm,
    vusFilm: state.vusFilm,
    action: state.action,
  };
}

export default connect(mapStateToProps)(FilmDetail);
