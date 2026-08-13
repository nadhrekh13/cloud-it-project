import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Azure VM Backend Base URL
const API_BASE_URL = 'http://51.103.15.186:5000/api';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking modal state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [seats, setSeats] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/movies`);
      setMovies(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies from the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (movie) => {
    setSelectedMovie(movie);
    setSeats(1);
    setCustomerName('');
    setBookingStatus(null);
  };

  const handleCloseBooking = () => {
    setSelectedMovie(null);
    setBookingStatus(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setIsSubmitting(true);
    setBookingStatus(null);

    const mId = String(selectedMovie._id || selectedMovie.id || '');
    const mTitle = selectedMovie.title || 'Movie';
    const cName = customerName.trim() || 'Guest';
    const numSeats = Number(seats);
    const ticketPrice = Number(selectedMovie.price) || 11;
    const totalAmount = ticketPrice * numSeats;

    // Multi-field payload designed to satisfy all standard Express/Mongoose booking schemas
    const bookingPayload = {
      // Movie fields
      movieId: mId,
      movie: mId,
      movieTitle: mTitle,
      title: mTitle,

      // Customer fields
      customerName: cName,
      name: cName,
      user: cName,
      userName: cName,
      email: `${cName.toLowerCase().replace(/\s+/g, '')}@example.com`,

      // Seat & pricing fields
      seats: numSeats,
      tickets: numSeats,
      quantity: numSeats,
      totalPrice: totalAmount,
      price: totalAmount,

      // Date / Time fallbacks
      showtime: '20:00',
      time: '20:00',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingPayload);
      
      setBookingStatus({
        type: 'success',
        message: `Booking successful! ID: ${response.data._id || response.data.id || response.data.bookingId || 'CONFIRMED'}`
      });
      
      // Auto close modal after 2.5 seconds on success
      setTimeout(() => {
        handleCloseBooking();
      }, 2500);
    } catch (err) {
      console.error('Error creating booking:', err);
      const serverError = err.response?.data?.error || err.response?.data?.message;
      setBookingStatus({
        type: 'error',
        message: serverError || 'Failed to complete booking. Check backend console.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <h2>Loading CineCloud Movies...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerContainer}>
        <h2 style={{ color: '#e74c3c' }}>{error}</h2>
        <button style={styles.button} onClick={fetchMovies}>Retry Connection</button>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>🎬 CineCloud Cinema</h1>
        <p>Select a movie and book your tickets</p>
      </header>

      <main style={styles.grid}>
        {movies.map((movie) => {
          const moviePrice = movie.price ?? movie.ticketPrice ?? 11.00;
          const movieId = movie._id || movie.id;

          return (
            <div key={movieId} style={styles.card}>
              <div style={styles.posterWrapper}>
                <img
                  src={movie.imageUrl || movie.posterUrl || movie.poster}
                  alt={movie.title}
                  style={styles.poster}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster+Available';
                  }}
                />
              </div>

              <div style={styles.cardDetails}>
                <h3 style={styles.movieTitle}>{movie.title}</h3>
                <p style={styles.genre}>{movie.genre || 'Feature Film'}</p>
                <p style={styles.price}>€{Number(moviePrice).toFixed(2)}</p>

                <button
                  style={styles.bookButton}
                  onClick={() => handleOpenBooking({ ...movie, price: moviePrice })}
                >
                  Book Tickets
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* Booking Modal */}
      {selectedMovie && (
        <div style={styles.modalOverlay} onClick={handleCloseBooking}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={handleCloseBooking}>✕</button>
            <h2>Book Tickets: {selectedMovie.title}</h2>
            <p>Price per ticket: <strong>€{Number(selectedMovie.price).toFixed(2)}</strong></p>

            <form onSubmit={handleBookingSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Seats:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.totalRow}>
                <span>Total Amount:</span>
                <strong>€{(Number(selectedMovie.price) * Number(seats)).toFixed(2)}</strong>
              </div>

              {bookingStatus && (
                <div style={{
                  ...styles.statusMessage,
                  backgroundColor: bookingStatus.type === 'success' ? '#27ae60' : '#e74c3c'
                }}>
                  {bookingStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styling Object
const styles = {
  app: {
    backgroundColor: '#121212',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  posterWrapper: {
    width: '100%',
    height: '380px',
    backgroundColor: '#2c2c2c',
    overflow: 'hidden'
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardDetails: {
    padding: '15px',
    width: '100%',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  movieTitle: {
    margin: '5px 0',
    fontSize: '1.2rem',
    color: '#fff'
  },
  genre: {
    fontSize: '0.85rem',
    color: '#aaa',
    margin: '0 0 10px 0'
  },
  price: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2ecc71',
    margin: '10px 0'
  },
  bookButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    width: '100%',
    transition: 'background 0.2s'
  },
  centerContainer: {
    backgroundColor: '#121212',
    color: '#fff',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif'
  },
  button: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#222',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '420px',
    position: 'relative',
    color: '#fff'
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    textAlign: 'left'
  },
  label: {
    fontSize: '0.9rem',
    color: '#ccc'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '1rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    margin: '10px 0'
  },
  submitButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  statusMessage: {
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.9rem'
  }
};

export default App;