import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { movies, bookings } from './movies.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/', (req, res) => {
  res.json({ status: 'Movie Booking API is running' });
});

// 2. GET all movies
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// 3. GET single movie by ID
app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
});

// 4. POST create booking
app.post('/api/bookings', (req, res) => {
  const { movieId, movieTitle, customerName, customerEmail, showtime, seats, totalAmount } = req.body;

  if (!movieId || !customerEmail || !seats || seats.length === 0) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const newBooking = {
    bookingId: `BK-${Date.now()}`,
    movieId,
    movieTitle,
    customerName,
    customerEmail,
    showtime,
    seats,
    totalAmount,
    bookingDate: new Date().toISOString(),
    status: 'CONFIRMED'
  };

  bookings.push(newBooking);

  return res.status(201).json({
    message: 'Booking created successfully',
    booking: newBooking
  });
});

// 5. GET booking by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find((b) => b.bookingId === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});