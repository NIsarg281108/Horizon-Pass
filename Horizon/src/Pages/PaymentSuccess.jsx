// src/Pages/PaymentSuccess.jsx
import { useLocation, Link, useEffect, useRef } from 'react';
import { useBookings } from '../Context/BookingContext';
import { useAuth } from '../Context/AuthContext';

function PaymentSuccess() {
  const location = useLocation();
  const { bookingData } = location.state || {};
  const { dispatch, state } = useBookings();
  const { user } = useAuth();
  const hasAddedBooking = useRef(false);

  useEffect(() => {
    if (bookingData && user && !hasAddedBooking.current) {
      // Check if booking already exists (prevent duplicates)
      const alreadyExists = state.bookings.some(
        (booking) =>
          booking.barcode === bookingData.barcode ||
          (booking.eventId === bookingData.eventId &&
            booking.date === bookingData.date &&
            booking.time === bookingData.time &&
            booking.userId === user.id)
      );

      if (!alreadyExists) {
        const newBooking = {
          ...bookingData,
          id: Date.now().toString(),
          userId: user.id,
          bookingDate: new Date().toISOString().split('T')[0],
          status: 'confirmed',
          barcode: Math.random().toString().substring(2, 12),
          foodOrders: [],
        };
        dispatch({ type: 'ADD_BOOKING', payload: newBooking });
        hasAddedBooking.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (!bookingData) {
    return (
      <div className="text-center">
        <div className="alert alert-warning">
          <h2>No booking information found</h2>
          <p>Please check your tickets in the profile section.</p>
        </div>
        <Link to="/profile" className="btn btn-primary">Go to My Tickets</Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="alert alert-success">
        <h2>Payment Successful!</h2>
        <p>Your tickets are booked. A confirmation email has been sent.</p>
      </div>
      <div className="card p-4 shadow-sm text-start">
        <h5>{bookingData.title}</h5>
        <p>{bookingData.venue} • {bookingData.date} • {bookingData.time}</p>
        <p>Tier: {bookingData.tier} | Quantity: {bookingData.quantity}</p>
        <p>Total Paid: <strong>${bookingData.totalPrice.toFixed(2)}</strong></p>
      </div>
      <Link to="/profile" className="btn btn-primary mt-3">
        Go to My Tickets
      </Link>
    </div>
  );
}

export default PaymentSuccess;