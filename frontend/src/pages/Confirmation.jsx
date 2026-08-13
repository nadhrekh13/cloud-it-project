import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function Confirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/${bookingId}`)
      .then(res => setBooking(res.data))
      .catch(err => console.error(err));
  }, [bookingId]);

  if (!booking) return <p>Loading ticket confirmation...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', background: '#1e293b', padding: '2rem', borderRadius: '8px', border: '2px dashed #38bdf8' }}>
      <h2 style={{ color: '#22c55e' }}>🎉 Booking Confirmed!</h2>
      <p style={{ color: '#94a3b8' }}>Booking ID: <strong>{booking.bookingId}</strong></p>
      
      <div style={{ textAlign: 'left', margin: '1.5rem 0', lineHeight: '1.8' }}>
        <p><strong>Movie:</strong> {booking.movieTitle}</p>
        <p><strong>Customer:</strong> {booking.customerName} ({booking.customerEmail})</p>
        <p><strong>Showtime:</strong> {booking.showtime}</p>
        <p><strong>Seats:</strong> {booking.seats?.join(', ')}</p>
        <p><strong>Total Paid:</strong> {booking.totalAmount?.toFixed(2)} €</p>
      </div>

      <Link to="/">
        <button style={{ padding: '0.75rem 1.5rem', background: '#38bdf8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Back to Movies
        </button>
      </Link>
    </div>
  );
}