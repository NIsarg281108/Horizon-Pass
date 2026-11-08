// Seat map layout used for Movies, Plays and Shows.
// This is a representative 6 × 10 layout, not a real venue plan.
export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F"];
export const SEATS_PER_ROW = 10;

// Returns a Set of seat codes already booked for this event and showtime
export function getTakenSeats(bookings, eventId, time) {
  const taken = new Set();
  if (!eventId) return taken;

  bookings.forEach((booking) => {
    if (
      booking.eventId === eventId &&
      booking.time === time &&
      booking.status === "confirmed" &&
      Array.isArray(booking.seats)
    ) {
      booking.seats.forEach((seat) => taken.add(seat));
    }
  });

  return taken;
}