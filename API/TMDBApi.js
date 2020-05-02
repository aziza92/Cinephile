import {Alert} from 'react-native';

const API_TOKEN = 'a9903efdfe7ff3421a085ba61e0d04a8';
export function getFilmsFromApiWithSearchedText(text, page) {
  const url =
    'https://api.themoviedb.org/3/search/movie?api_key=' +
    API_TOKEN +
    '&language=fr&query=' +
    text +
    '&page=' +
    page;
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
}
export function getImageFromApi(name) {
  return 'https://image.tmdb.org/t/p/w300' + name;
}

// Récupération du détail d'un film
export function getFilmDetailFromApi(id) {
  return fetch(
    'https://api.themoviedb.org/3/movie/' +
      id +
      '?api_key=' +
      API_TOKEN +
      '&language=fr',
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}
// Récupération des derniers films
export function getBestFilmsFromApi(page) {
  return fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      API_TOKEN +
      '&vote_count.gte=1000&sort_by=release_date.desc&language=fr&page=' +
      page,
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}

// Récupération des films sur base des notes>6.9 par ordre descendant
export function getFilmsSortedByDescRatingFromApi(page) {
  return fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      API_TOKEN +
      '&vote_average.gte=6.9&release_date.gte=2019-10-01&release_date.lte=2020-01-01&sort_by=vote_average.desc&sort_by=release_date.desc&language=US&page=' +
      page,
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}

// Récupération des films sur base de l'ordre alphabétique des films
export function getFilmsSortedByAscTitleFromApi(page) {
  return fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      API_TOKEN +
      '&vote_count.gte=100&release_date.gte=2019-10-01&release_date.lte=2020-01-01&sort_by=title.asc&sort_by=release_date.desc&language=fr&page=' +
      page,
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}
// Récupération des films sur base de genres (Action)
export function getFilmsSortedByGenreActionFromApi(page) {
  return fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      API_TOKEN +
      '&with_genres=28&language=fr&page=' +
      page,
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}
// Récupération des films sur base de genres (Horror)
export function getFilmsSortedByGenreHorrorFromApi(page) {
  return fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      API_TOKEN +
      '&with_genres=27&language=fr&page=' +
      page,
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}

export function getNewFilmFromApi(page) {
  var today = new Date();
  var month =
    today.getMonth() + 1 < 10
      ? '0' + (today.getMonth() + 1)
      : today.getMonth() + 1;

  var day =
    today.getDate() + 1 < 10
      ? '0' + (today.getDate() + 1)
      : today.getDate() + 1;

  return fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      API_TOKEN +
      '&release_date.gte=2019-09-01&release_date.lte=' +
      today.getFullYear() +
      '-' +
      month +
      '-' +
      day +
      '&language=fr&page=' +
      page,
  )
    .then(response => response.json())
    .catch(error => console.error(error));
}
