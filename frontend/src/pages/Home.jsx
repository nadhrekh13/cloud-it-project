import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Now Showing</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
        {movies.map(movie => (
          <div key={movie.id} style={{ background: '#1e293b', borderRadius: '8px', overflow: 'hidden', padding: '1rem' }}>
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px' }} 
            />
            <h3 style={{ marginTop: '0.75rem' }}>{movie.title}</h3>
            <p style={{ color: '#94a3b8' }}>{movie.genre} • ⭐ {movie.rating}</p>
            <p style={{ fontWeight: 'bold', color: '#38bdf8' }}>{movie.ticketPrice.toFixed(2)} €</p>
            <Link to={`/movie/${movie.id}`}>
              <button style={{ width: '100%', padding: '0.5rem', background: '#38bdf8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                View Showtimes
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}