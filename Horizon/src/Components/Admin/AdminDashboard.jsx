import { useEvents } from '../../Context/EventContext';
import { useBookings } from '../../Context/BookingContext';
import { useAuth } from '../../Context/AuthContext';
import RevenueChart from './RevenueChart';

function AdminDashboard() {
  const { state: eventState } = useEvents();
  const { state: bookingState } = useBookings();
  const { registeredUsers } = useAuth();

  const totalEvents = eventState.events.length;
  const totalBookings = bookingState.bookings.length;
  const totalUsers = 2 + registeredUsers.length; // 2 demo users

  // Group bookings by user for display
  const bookingsByUser = {};
  bookingState.bookings.forEach((booking) => {
    if (!bookingsByUser[booking.userId]) {
      bookingsByUser[booking.userId] = [];
    }
    bookingsByUser[booking.userId].push(booking);
  });

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Events</h5>
              <p className="card-text display-6">{totalEvents}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Bookings</h5>
              <p className="card-text display-6">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <RevenueChart />
      </div>

      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">Users & Their Tickets</h5>
        {Object.keys(bookingsByUser).length === 0 ? (
          <p className="text-muted">No tickets booked yet.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Event</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(bookingsByUser).map((userId) =>
                bookingsByUser[userId].map((booking, idx) => {
                  const event = eventState.events.find((e) => e.id === booking.eventId);
                  return (
                    <tr key={`${userId}-${idx}`}>
                      <td>{userId}</td>
                      <td>{event ? event.title : 'Unknown'}</td>
                      <td>{booking.date}</td>
                      <td>{booking.quantity}</td>
                      <td>${booking.totalPrice.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;