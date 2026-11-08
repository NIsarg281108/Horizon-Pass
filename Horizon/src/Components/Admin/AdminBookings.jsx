import { useBookings } from "../../Context/BookingContext";
import { useEvents } from "../../Context/EventContext";
import { cancelBookingAndRelease } from "../../Utils/bookingActions";
import { downloadCsv } from "../../Utils/csv";

function AdminBookings() {
  const { state, dispatch } = useBookings();
  const { state: eventState, dispatch: eventDispatch } = useEvents();

  const eventFor = (id) => eventState.events.find((e) => e.id === id);

  const handleCancel = (booking) => {
    if (window.confirm("Cancel this booking and return its tickets?")) {
      cancelBookingAndRelease(dispatch, eventDispatch, booking);
    }
  };

  const exportCsv = () => {
    if (!state.bookings.length) {
      alert("There are no bookings to export.");
      return;
    }
    const rows = state.bookings.map((b) => {
      const event = eventFor(b.eventId);
      return {
        booking_id: b.id,
        booking_date: b.bookingDate || "",
        user_id: b.userId,
        event: event?.title || b.title || "Unknown",
        category: b.category || event?.category || "",
        show_date: b.date,
        show_time: b.time,
        tier: b.tier,
        seats: (b.seats || []).join(" "),
        quantity: b.quantity,
        total_paid: Number(b.totalPrice || 0).toFixed(2),
        coupon: b.couponCode || "",
        status: b.status,
        barcode: b.barcode || "",
      };
    });
    downloadCsv(`bookings-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Manage bookings</h2>
        <button type="button" className="btn btn-outline-primary" onClick={exportCsv}>
          ⬇ Export CSV
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Event</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.bookings.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No bookings yet.
                </td>
              </tr>
            )}
            {state.bookings.map((booking) => {
              const event = eventFor(booking.eventId);
              return (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userId}</td>
                  <td>{event?.title || booking.title || "Unknown"}</td>
                  <td>{booking.date}</td>
                  <td>{booking.seats?.length ? booking.seats.join(", ") : "—"}</td>
                  <td>{booking.quantity}</td>
                  <td>${Number(booking.totalPrice || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${booking.status === "cancelled" ? "cancelled" : ""}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === "confirmed" && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancel(booking)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;