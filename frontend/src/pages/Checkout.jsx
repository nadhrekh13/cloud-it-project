import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout({ booking }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const total = (booking.seats?.length || 0) * (booking.movie?.ticketPrice || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        movieId: booking.movie.id,
        movieTitle: booking.movie.title,
        customerName: name,
        customerEmail: email,
        showtime: booking.showtime,
        seats: booking.seats,
        totalAmount: total
      });
      navigate(`/confirmation/${response.data.booking.bookingId}`);
    } catch (err) {
      alert('Error creating booking');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '8px' }}>
      <h2>Checkout & Payment</h2>
      <div style={{ margin: '1rem 0', padding: '1rem', background: '#334155', borderRadius: '4px' }}>
        <p><strong>Movie:</strong> {booking.movie?.title}</p>
        <p><strong>Showtime:</strong> {booking.showtime}</p>
        <p><strong>Seats:</strong> {booking.seats?.join(', ')}</p>
        <p><strong>Total Price:</strong> {total.toFixed(2)} €</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          placeholder="Full Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569' }} 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569' }} 
        />
        <button 
          type="submit" 
          style={{ padding: '0.75rem', background: '#38bdf8', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Confirm & Pay {total.toFixed(2)} €
        </button>
      </form>
    </div>
  );
}