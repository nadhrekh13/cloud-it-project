import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MovieDetails({ setBooking }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState('');

  useEffect(() => {
    axios.get(`http://http://51.103.15.186:5000/api/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <p>Loading details...</p>;

  const handleProceed = () => {
    if (!selectedShowtime) return alert('Please select a showtime');
    setBooking(prev => ({ ...prev, movie, showtime: selectedShowtime }));
    navigate(`/seats/${movie.id}`);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', maxWidth: '800px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '8px' }}>
      <img src={movie.posterUrl} alt={movie.title} style={{ width: '250px', borderRadius: '8px' }} />
      <div>
        <h2>{movie.title}</h2>
        <p style={{ color: '#94a3b8' }}>{movie.duration} | {movie.genre} | ⭐ {movie.rating}</p>
        <p style={{ margin: '1rem 0' }}>{movie.synopsis}</p>
        
        <h4>Select Showtime:</h4>
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
          {movie.showtimes.map(t => (
            <button 
              key={t} 
              onClick={() => setSelectedShowtime(t)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedShowtime === t ? '#38bdf8' : '#334155',
                color: selectedShowtime === t ? '#000' : '#fff',
                border: 'none'
              }}>
              {t}
            </button>
          ))}
        </div>

        <button 
          onClick={handleProceed}
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Choose Seats ➔
        </button>
      </div>
    </div>
  );
}