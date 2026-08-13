import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';

export default function App() {
  const [currentBooking, setCurrentBooking] = useState({
    movie: null,
    showtime: null,
    seats: [],
    customerName: '',
    customerEmail: ''
  });

  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' }}>
          <Link to="/" style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            🎬 CineCloud
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Home</Link>
          </div>
        </nav>

        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails setBooking={setCurrentBooking} />} />
            <Route path="/seats/:id" element={<SeatSelection booking={currentBooking} setBooking={setCurrentBooking} />} />
            <Route path="/checkout" element={<Checkout booking={currentBooking} setBooking={setCurrentBooking} />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}