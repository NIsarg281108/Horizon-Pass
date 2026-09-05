// src/Components/Profile/MyTickets.jsx
import { useAuth } from '../../Context/AuthContext';
import { useBookings } from '../../Context/BookingContext';

function MyTickets({ onOrderFood }) {
  const { user } = useAuth();
  const { state } = useBookings();

  const myBookings = state.bookings.filter(
    (booking) => booking.userId === user.id
  );

  if (myBookings.length === 0) {
    return <p>You have no tickets yet.</p>;
  }

  return (
    <div className="row">
      {myBookings.map((booking) => (
        <div className="col-md-6 mb-3" key={booking.id}>
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex">
                <img
                  src={booking.imageUrl}
                  alt={booking.title}
                  style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                  className="me-3 rounded"
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{booking.title}</h5>
                  <p className="mb-1 small">{booking.venue}</p>
                  <p className="mb-1 small">
                    {booking.date} • {booking.time}
                  </p>
                  <p className="mb-1 small">Tier: {booking.tier} | Qty: {booking.quantity}</p>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="badge bg-success">{booking.status}</span>
                <span className="small">Barcode: {booking.barcode}</span>
              </div>
              <button
                className="btn btn-outline-primary btn-sm mt-2 w-100"
                onClick={() => onOrderFood(booking.id)}
              >
                Order Food
              </button>
              {booking.foodOrders && booking.foodOrders.length > 0 && (
                <div className="mt-2">
                  <small>Food orders:</small>
                  <ul className="list-unstyled small">
                    {booking.foodOrders.map((order, idx) => (
                      <li key={idx}>
                        {order.items.map((item) => item.name).join(', ')} - ${order.total}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyTickets;