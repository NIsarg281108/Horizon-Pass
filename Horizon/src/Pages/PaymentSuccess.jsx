// src/Pages/PaymentSuccess.jsx
import { useLocation, Link, useEffect } from 'react';
import { useBookings } from '../Context/BookingContext';
import { useAuth } from '../Context/AuthContext';

function PaymentSuccess() {
  const location = useLocation();
  const { bookingData } = location.state || {};
  const { dispatch } = useBookings();
  const { user } = useAuth();

  useEffect(() => {
    if (bookingData && user) {
      const newBooking = {
        ...bookingData,
        id: Date.now().toString(),
        userId: user.id,           // Add userId for filtering
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        barcode: Math.random().toString().substring(2, 12),
        foodOrders: [],
      };
      dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <div className="text-center">
      <div className="alert alert-success">
        <h2>Payment Successful!</h2>
        <p>Your tickets are booked. A confirmation email has been sent.</p>
      </div>
      {bookingData && (
        <div className="card p-4 shadow-sm text-start">
          <h5>{bookingData.title}</h5>
          <p>{bookingData.venue} • {bookingData.date} • {bookingData.time}</p>
          <p>Tier: {bookingData.tier} | Quantity: {bookingData.quantity}</p>
          <p>Total Paid: <strong>${bookingData.totalPrice.toFixed(2)}</strong></p>
        </div>
      )}
      <Link to="/profile" className="btn btn-primary mt-3">
        Go to My Tickets
      </Link>
    </div>
  );
}

export default PaymentSuccess;