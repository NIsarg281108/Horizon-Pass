import { useEvents } from '../../Context/EventContext';
import { useBookings } from '../../Context/BookingContext';
import { useAuth } from '../../Context/AuthContext'; // optional, for total users

function AdminDashboard() {
  const { state: eventState } = useEvents();
  const { state: bookingState } = useBookings();
  const { registeredUsers } = useAuth();
  const totalEvents = eventState.events.length;
  const totalBookings = bookingState.bookings.length;
  const totalUsers = 2 + registeredUsers.length; // 2 demo users

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
    </div>
  );
}

export default AdminDashboard;