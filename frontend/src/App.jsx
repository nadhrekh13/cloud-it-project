import React, { useEffect, useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://<1.103.15.186:5000";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movies`)
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <h1>🎬 CineCloud</h1>
        <nav><a href="#home">Home</a></nav>
      </header>

      <main className="content">
        <h2>Now Showing</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.posterUrl} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p className="price">{movie.price} €</p>
              <button>Book Tickets</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;