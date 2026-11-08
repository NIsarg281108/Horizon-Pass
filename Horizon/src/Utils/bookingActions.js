// Reserve tickets when a booking is confirmed
export function confirmBookingTickets(eventDispatch, eventId, quantity) {
  eventDispatch({
    type: "ADJUST_TICKETS",
    payload: { eventId, delta: -Number(quantity) },
  });
}

// Cancel a booking and return its tickets to the event.
// Returns false if the booking was not confirmed, so tickets are never returned twice.
export function cancelBookingAndRelease(bookingDispatch, eventDispatch, booking) {
  if (booking.status !== "confirmed") return false;

  bookingDispatch({ type: "CANCEL_BOOKING", payload: booking.id });
  eventDispatch({
    type: "ADJUST_TICKETS",
    payload: { eventId: booking.eventId, delta: Number(booking.quantity) },
  });
  return true;
}
