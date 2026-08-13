import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_SEATS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];

export default function SeatSelection({ booking, setBooking }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleSeat = (seat) => {
    setSelected(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  };

  const handleNext = () => {
    if (selected.length === 0) return alert('Please choose at least 1 seat');
    setBooking(prev => ({ ...prev, seats: selected }));
    navigate('/checkout');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', background: '#1e293b', padding: '2rem', borderRadius: '8px' }}>
      <h2>Select Your Seats</h2>
      <p style={{ color: '#94a3b8' }}>Movie: {booking.movie?.title} ({booking.showtime})</p>

      <div style={{ margin: '2rem 0', background: '#475569', padding: '0.5rem', borderRadius: '4px' }}>SCREEN</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {ALL_SEATS.map(seat => (
          <button
            key={seat}
            onClick={() => toggleSeat(seat)}
            style={{
              padding: '1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: selected.includes(seat) ? '#38bdf8' : '#334155',
              color: selected.includes(seat) ? '#000' : '#fff',
              fontWeight: 'bold'
            }}>
            {seat}
          </button>
        ))}
      </div>

      <p>Selected Seats: {selected.join(', ') || 'None'}</p>
      <button 
        onClick={handleNext} 
        style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        Proceed to Checkout
      </button>
    </div>
  );
}