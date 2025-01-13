'use client';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = import.meta.env.VITE_TMDB_API_URL;
  const IMG_PATH = import.meta.env.VITE_TMDB_IMG_PATH;

  useEffect(() => {
    fetch(
      `${API_URL}?api_key=${API_KEY}&include_adult=false&include_video=false&language=jp-JP&primary_release_year=2024&sort_by=primary_release_date.desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
      });
  }, [API_KEY, API_URL]);
  return (
    <>
      <div className="container">
        {movies.map((movie, index) => (
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
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
