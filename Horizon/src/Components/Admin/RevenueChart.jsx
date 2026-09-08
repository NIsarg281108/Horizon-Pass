import { useBookings } from '../../Context/BookingContext';
import { useEvents } from '../../Context/EventContext';

function RevenueChart() {
  const { state: bookingState } = useBookings();
  const { state: eventState } = useEvents();

  // Revenue by category
  const revenueByCategory = {};
  bookingState.bookings.forEach((booking) => {
    const event = eventState.events.find((e) => e.id === booking.eventId);
    if (event) {
      const cat = event.category;
      if (!revenueByCategory[cat]) revenueByCategory[cat] = 0;
      revenueByCategory[cat] += booking.totalPrice;
    }
  });

  // Bookings over time (last 7 days)
  const bookingsByDate = {};
  bookingState.bookings.forEach((booking) => {
    const date = booking.bookingDate || booking.date; // fallback
    if (!bookingsByDate[date]) bookingsByDate[date] = 0;
    bookingsByDate[date] += booking.totalPrice;
  });

  // Sort dates ascending
  const sortedDates = Object.keys(bookingsByDate).sort();
  const maxRevenue = Math.max(...Object.values(bookingsByDate), 1);

  // Top selling events
  const topEvents = {};
  bookingState.bookings.forEach((booking) => {
    const event = eventState.events.find((e) => e.id === booking.eventId);
    if (event) {
      if (!topEvents[event.title]) topEvents[event.title] = 0;
      topEvents[event.title] += booking.quantity;
    }
  });
  const topEventsList = Object.entries(topEvents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h5 className="mb-3">Revenue by Category</h5>
      <div className="d-flex align-items-end mb-4" style={{ height: '150px' }}>
        {Object.keys(revenueByCategory).length === 0 ? (
          <p className="text-muted">No revenue data yet.</p>
        ) : (
          Object.keys(revenueByCategory).map((cat) => (
            <div key={cat} className="me-3 text-center">
              <div
                className="bg-primary"
                style={{
                  width: '60px',
                  height: `${(revenueByCategory[cat] / maxRevenue) * 120}px`,
                  minHeight: '10px',
                }}
              ></div>
              <small className="d-block mt-1">{cat}</small>
              <small>${revenueByCategory[cat].toFixed(0)}</small>
            </div>
          ))
        )}
      </div>

      <h5 className="mb-3">Bookings Over Time (Revenue per Date)</h5>
      <div className="d-flex align-items-end mb-4" style={{ height: '150px', overflowX: 'auto' }}>
        {sortedDates.length === 0 ? (
          <p className="text-muted">No data available.</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="me-3 text-center">
              <div
                className="bg-success"
                style={{
                  width: '40px',
                  height: `${(bookingsByDate[date] / maxRevenue) * 120}px`,
                  minHeight: '10px',
                }}
              ></div>
              <small className="d-block mt-1">{date}</small>
              <small>${bookingsByDate[date].toFixed(0)}</small>
            </div>
          ))
        )}
      </div>

      <h5 className="mb-3">Top Selling Events</h5>
      {topEventsList.length === 0 ? (
        <p className="text-muted">No sales yet.</p>
      ) : (
        <ul className="list-group">
          {topEventsList.map(([title, qty]) => (
            <li key={title} className="list-group-item d-flex justify-content-between">
              <span>{title}</span>
              <span>{qty} tickets</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RevenueChart;