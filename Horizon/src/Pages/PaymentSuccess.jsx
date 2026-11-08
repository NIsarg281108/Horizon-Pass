// src/Pages/PaymentSuccess.jsx
import { useLocation, Link } from "react-router";
import { useEffect, useRef } from "react";
import { useBookings } from "../Context/BookingContext";
import { useAuth } from "../Context/AuthContext";
import { useEvents } from "../Context/EventContext";
import { confirmBookingTickets } from "../Utils/bookingActions";

const PROCESSED_KEY = "horizon_processed_payments";

function PaymentSuccess() {
  const location = useLocation();
  const { bookingData, paymentId } = location.state || {};
  const { dispatch } = useBookings();
  const { dispatch: eventDispatch } = useEvents();
  const { user } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!bookingData || !user || !paymentId || hasRun.current) return;
    hasRun.current = true;

    // Each payment is recorded once, even if the page is refreshed
    const processed = JSON.parse(localStorage.getItem(PROCESSED_KEY) || "[]");
    if (processed.includes(paymentId)) return;
    localStorage.setItem(
      PROCESSED_KEY,
      JSON.stringify([...processed, paymentId]),
    );

    const newBooking = {
      ...bookingData,
      id: Date.now().toString(),
      userId: user.id,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "confirmed",
      barcode: Math.random().toString().substring(2, 12),
      foodOrders: [],
    };

    dispatch({ type: "ADD_BOOKING", payload: newBooking });
    confirmBookingTickets(eventDispatch, bookingData.eventId, bookingData.quantity);
  }, [bookingData, paymentId, user, dispatch, eventDispatch]);

  if (!bookingData) {
    return (
      <div className="text-center">
        <div className="alert alert-warning">
          <h2>No booking information found</h2>
          <p>Please check your tickets in the profile section.</p>
        </div>
        <Link to="/profile" className="btn btn-primary">
          Go to My Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="alert alert-success">
        <h2>Payment successful!</h2>
        <p>Your tickets are booked.</p>
      </div>
      <div className="card p-4 shadow-sm text-start">
        <h5>{bookingData.title}</h5>
        <p>
          {bookingData.venue} • {bookingData.date} • {bookingData.time}
        </p>
        <p>
          Tier: {bookingData.tier} | Quantity: {bookingData.quantity}
        </p>
        {bookingData.seats?.length > 0 && (
          <p>Seats: {bookingData.seats.join(", ")}</p>
        )}
        <p>
          Total paid: <strong>${Number(bookingData.totalPrice).toFixed(2)}</strong>
        </p>
      </div>
      <Link to="/profile" className="btn btn-primary mt-3">
        Go to My Tickets
      </Link>
    </div>
  );
}

export default PaymentSuccess;