const API_KEY = "216f8674814555ede96fdbe2f4f66f93";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

interface ITV {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTVsResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITV[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}

// TV

export function getlatestTV() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}

export function getratedTV() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}
export function getairingTV() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}

export function getPopularTV() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(res =>
    res.json()
  );
}

export function getSearchTV(search: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${search}`
  ).then(res => res.json());
}

export function getSearchMovie(search: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${search}`
  ).then(res => res.json());
}
