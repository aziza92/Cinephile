// Components/News.js

import React from 'react'
import {Alert, StyleSheet,View, Image,TouchableOpacity } from 'react-native'
import FilmList from './FilmList'
import { getBestFilmsFromApi, getFilmsSortedByDescRatingFromApi, getFilmsSortedByAscTitleFromApi } from '../API/TMDBApi'

class News extends React.Component {
  constructor(props) {
    super(props)
    this.page = 0
    this.totalPages = 0
    stateButton = false
    this.state = {
      films: [],
      isLoading: false,
      uri: require('../Images/sort_nom.png')
    }
      this._loadFilms = this._loadFilms.bind(this),
      this._sortFav = this._sortFav.bind(this),
      this._sortNom = this._sortNom.bind(this)
  }

  componentDidMount() {
    this._loadFilms();
  }

_loadFilms() {
    this.setState({ isLoading: true })
    getBestFilmsFromApi(this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [ ...this.state.films, ...data.results ],
          isLoading: false
        })
    })
  }
  //tri par votes
  _sortFav(){
    getFilmsSortedByDescRatingFromApi(this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [ ...this.state.films, ...data.results ]
        })
    })
  }

  // tri sur le nom
  _sortNom(){
    //Alert.alert("ok nom")
    getFilmsSortedByAscTitleFromApi(this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [ ...this.state.films, ...data.results ],

        })
    })
  }
  _onPress(){
    if (stateButton == false)
    {
      this.setState({
        films:[],
        uri:require('../Images/sort_fav.png'),
      }),
      stateButton = true,
      this._sortFav()
    }
    else
    {
      this.setState({
        films:[],
        uri:require('../Images/sort_nom.png')
    }),
      stateButton = false,
      this._sortNom()
    }
     
  }

  render() {
    return (
      <View style={styles.main_container} >

      <View style={styles.main}>
      <TouchableOpacity onPress={() => this._onPress()} >
      <Image
        style={styles.image}
        source={this.state.uri}

      />
      </TouchableOpacity>
      </View>
      <FilmList
        films={this.state.films}
        navigation={this.props.navigation}
        loadFilms={this._loadFilms}
        sortFav={this._sortFav}
        sortNom={this._sortNom}

        page={this.page}
        totalPages={this.totalPages}
        favoriteList={false}
      />
      </View>

    )
  }
}
const styles = StyleSheet.create({
  main_container:{
    flex: 1,
  },
  main:{
     flexDirection:'row-reverse',
     margin:10
  },

  image:{
    width: 35,
    height: 35,
  }

})

export default News
