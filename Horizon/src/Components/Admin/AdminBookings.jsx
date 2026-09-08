import { useBookings } from '../../Context/BookingContext';
import { useEvents } from '../../Context/EventContext';

function AdminBookings() {
  const { state, dispatch } = useBookings();
  const { state: eventState } = useEvents();

  const handleCancel = (id) => {
    if (window.confirm('Cancel this booking?')) {
      dispatch({ type: 'CANCEL_BOOKING', payload: id });
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Bookings</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Event</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.bookings.map((booking) => {
            const event = eventState.events.find((e) => e.id === booking.eventId);
            return (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.userId}</td>
                <td>{event?.title || 'Unknown'}</td>
                <td>{booking.date}</td>
                <td>{booking.quantity}</td>
                <td>${booking.totalPrice.toFixed(2)}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status !== 'cancelled' && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleCancel(booking.id)}>
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
  );
}

export default AdminBookings;