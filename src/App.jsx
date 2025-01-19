'use client';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchWord, setSearchWord] = useState('');
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = import.meta.env.VITE_TMDB_API_URL;
  const IMG_PATH = import.meta.env.VITE_TMDB_IMG_PATH;

  useEffect(() => {
    fetch(
      `${API_URL}?api_key=${API_KEY}&include_adult=false&include_video=false&language=ja&primary_release_year=${selectedYear}&sort_by=primary_release_date.desc&page=${page}&total_results=20`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
      });

    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ja`
    )
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
      });
  }, [API_KEY, API_URL, page, selectedYear]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const changeYear = (e) => {
    setSelectedYear(e.target.value);
    setPage(1);
    setMovies([]);
    setSearchWord('');
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setSearchWord(e.target.value);
  };

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter((name) => name)
      .join(', ');
  };

  const getDisplayMovies = () => {
    if (!searchWord) {
      return movies;
    }
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchWord.toLowerCase())
    );
  };

  const displayMovies = getDisplayMovies();

  return (
    <>
      <div className="contentWrap">
        <h1>Movie Search</h1>

        <din className="searchWrap">
          <form onSubmit={searchHandler}>
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="映画を検索..."
            />
            <button type="submit">検索</button>
          </form>
          <div className="selectWrap">
            <select
              value={selectedYear || ''}
              onChange={changeYear}
              name="selectYear"
            >
              <option value="">選択してください</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </din>

        <div className="container">
          {displayMovies.length > 0 ? (
            displayMovies.map((movie, index) => (
              <div className="movieCard" key={index}>
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_PATH}${movie.poster_path}`
                      : '/placeholder.png'
                  }
                  alt={movie.title}
                />
                <h2 className="movieTitle">{movie.title}</h2>
                <p className="releaseDate">{movie.release_date}</p>
                <p className="genres">{getGenreNames(movie.genre_ids)}</p>
              </div>
            ))
          ) : (
            <p className="no-results">検索結果がありませんでした。</p>
          )}
        </div>
        {!searchWord && displayMovies.length > 0 && (
          <div className="load-more">
            <button onClick={loadMore}>さらに読み込む</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
