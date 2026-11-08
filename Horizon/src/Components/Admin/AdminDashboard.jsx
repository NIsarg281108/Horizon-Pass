import { useEvents } from "../../Context/EventContext";
import { useBookings } from "../../Context/BookingContext";
import { useAuth } from "../../Context/AuthContext";
import { useReviews } from "../../Context/ReviewContext";
import { useWishlist } from "../../Context/WishlistContext";
import { useMemo, useState } from "react";
import RevenueChart from "./RevenueChart";
import {
  RANGE_OPTIONS,
  comparePeriods,
  countUsersInRange,
  growth,
  fmtChange,
} from "../../Utils/analytics";
import { downloadCsv } from "../../Utils/csv";

function AdminDashboard() {
  const { state: eventState } = useEvents();
  const { state: rawBookingState } = useBookings();
  const { registeredUsers } = useAuth();
  const { getAverageRating } = useReviews();
  const { wishlist } = useWishlist();
  const [timeRange, setTimeRange] = useState("7");

  // All the dashboard maths below use only bookings in the selected range
  const periods = useMemo(
    () => comparePeriods(rawBookingState.bookings, timeRange),
    [rawBookingState.bookings, timeRange],
  );
  const { current: scopedBookings, previous: priorBookings } = periods;
  const bookingState = { bookings: scopedBookings };

  const userCounts = useMemo(
    () => countUsersInRange(registeredUsers, timeRange),
    [registeredUsers, timeRange],
  );

  const sumRevenue = (list) =>
    list.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const changes = {
    revenue: growth(sumRevenue(scopedBookings), sumRevenue(priorBookings)),
    bookings: growth(scopedBookings.length, priorBookings.length),
    users: growth(userCounts.current, userCounts.previous),
  };

  const exportRevenue = () => {
    if (!scopedBookings.length) {
      alert("No bookings in this period.");
      return;
    }
    const rows = scopedBookings.map((b) => ({
      booking_id: b.id,
      booking_date: b.bookingDate || "",
      event: b.title,
      category: b.category,
      quantity: b.quantity,
      total_paid: Number(b.totalPrice || 0).toFixed(2),
      status: b.status,
    }));
    downloadCsv(
      `revenue-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`,
      rows,
    );
  };

  const totalEvents = eventState.events.length;
  const totalBookings = bookingState.bookings.length;
  const totalUsers = 2 + registeredUsers.length;

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = bookingState.bookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );
    const avgOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Category breakdown
    const categoryStats = {};
    eventState.events.forEach((event) => {
      if (!categoryStats[event.category]) {
        categoryStats[event.category] = { count: 0, bookings: 0, revenue: 0 };
      }
      categoryStats[event.category].count++;
    });

    bookingState.bookings.forEach((booking) => {
      const event = eventState.events.find((e) => e.id === booking.eventId);
      if (event && categoryStats[event.category]) {
        categoryStats[event.category].bookings++;
        categoryStats[event.category].revenue += booking.totalPrice || 0;
      }
    });

    // Top performing events
    const eventPerformance = eventState.events
      .map((event) => {
        const eventBookings = bookingState.bookings.filter(
          (b) => b.eventId === event.id,
        );
        const ticketsSold = eventBookings.reduce(
          (sum, b) => sum + b.quantity,
          0,
        );
        const revenue = eventBookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0,
        );
        const rating = getAverageRating(event.id);
        const wishlistCount = wishlist.filter((id) => id === event.id).length;

        return {
          ...event,
          ticketsSold,
          revenue,
          rating,
          wishlistCount,
          occupancyRate:
            event.totalTickets > 0
              ? (ticketsSold / event.totalTickets) * 100
              : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    // User engagement metrics
    const activeUsers = new Set(bookingState.bookings.map((b) => b.userId))
      .size;
    const repeatCustomers = Object.entries(
      bookingState.bookings.reduce((acc, b) => {
        acc[b.userId] = (acc[b.userId] || 0) + 1;
        return acc;
      }, {}),
    ).filter(([, count]) => count > 1).length;

    // Recent activity
    const recentBookings = [...bookingState.bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
      )
      .slice(0, 5);

    return {
      totalRevenue,
      avgOrderValue,
      categoryStats,
      eventPerformance,
      activeUsers,
      repeatCustomers,
      recentBookings,
      conversionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    };
  }, [
    eventState.events,
    bookingState.bookings,
    totalUsers,
    totalBookings,
    getAverageRating,
    wishlist,
  ]);

  // Group bookings by user for display
  const bookingsByUser = {};
  bookingState.bookings.forEach((booking) => {
    if (!bookingsByUser[booking.userId]) {
      bookingsByUser[booking.userId] = [];
    }
    bookingsByUser[booking.userId].push(booking);
  });

  return (
    <div className="admin-dashboard-enhanced">
      <div className="dashboard-header">
        <h2>📊 Admin dashboard</h2>
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={exportRevenue}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">
              ${analytics.totalRevenue.toFixed(2)}
            </div>
            <div className="metric-label">Revenue in range</div>
            <div
              className={`metric-change ${changes.revenue >= 0 ? "positive" : "negative"}`}
            >
              {fmtChange(changes.revenue)}
            </div>
          </div>
        </div>
        <div className="metric-card bookings">
          <div className="metric-icon">🎫</div>
          <div className="metric-content">
            <div className="metric-value">{totalBookings}</div>
            <div className="metric-label">Bookings in range</div>
            <div
              className={`metric-change ${changes.bookings >= 0 ? "positive" : "negative"}`}
            >
              {fmtChange(changes.bookings)}
            </div>
          </div>
        </div>
        <div className="metric-card users">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{totalUsers}</div>
            <div className="metric-label">Total users</div>
            <div
              className={`metric-change ${changes.users >= 0 ? "positive" : "negative"}`}
            >
              {fmtChange(changes.users)}
            </div>
          </div>
        </div>
        <div className="metric-card events">
          <div className="metric-icon">🎭</div>
          <div className="metric-content">
            <div className="metric-value">{totalEvents}</div>
            <div className="metric-label">Active events</div>
            <div className="metric-change neutral">Not tracked</div>
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="secondary-metrics">
        <div className="secondary-metric">
          <div className="secondary-label">Average order value</div>
          <div className="secondary-value">
            ${analytics.avgOrderValue.toFixed(2)}
          </div>
        </div>
        <div className="secondary-metric">
          <div className="secondary-label">Active users</div>
          <div className="secondary-value">{analytics.activeUsers}</div>
        </div>
        <div className="secondary-metric">
          <div className="secondary-label">Repeat customers</div>
          <div className="secondary-value">{analytics.repeatCustomers}</div>
        </div>
        <div className="secondary-metric">
          <div className="secondary-label">Conversion rate</div>
          <div className="secondary-value">
            {analytics.conversionRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-card main-chart">
          <h3>Revenue overview</h3>
          <RevenueChart />
        </div>
        <div className="chart-card category-chart">
          <h3>Category performance</h3>
          <div className="category-breakdown">
            {Object.entries(analytics.categoryStats).map(
              ([category, stats]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-stats">
                      {stats.bookings} bookings • ${stats.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-progress"
                      style={{
                        width: `${stats.bookings > 0 ? (stats.bookings / totalBookings) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Top performing events */}
      <div className="top-events-section">
        <h3>🏆 Top performing events</h3>
        <div className="top-events-grid">
          {analytics.eventPerformance.slice(0, 4).map((event, index) => (
            <div key={event.id} className="top-event-card">
              <div className="event-rank">#{index + 1}</div>
              <img
                src={event.imageUrl}
                alt={event.title}
                className="top-event-image"
              />
              <div className="top-event-info">
                <h4>{event.title}</h4>
                <p className="event-category">{event.category}</p>
                <div className="event-metrics">
                  <div className="metric">
                    <span className="metric-label">Revenue</span>
                    <span className="metric-value">
                      ${event.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Tickets</span>
                    <span className="metric-value">{event.ticketsSold}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Rating</span>
                    <span className="metric-value">
                      {event.rating.toFixed(1)}⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="recent-activity-section">
        <h3>📋 Recent activity</h3>
        <div className="activity-list">
          {analytics.recentBookings.length === 0 ? (
            <p className="text-muted">No recent activity</p>
          ) : (
            analytics.recentBookings.map((booking) => {
              const event = eventState.events.find(
                (e) => e.id === booking.eventId,
              );
              return (
                <div key={booking.id} className="activity-item">
                  <div className="activity-icon">🎫</div>
                  <div className="activity-details">
                    <strong>{event?.title || "Unknown event"}</strong>
                    <p className="activity-meta">
                      User {booking.userId} • {booking.quantity} tickets • $
                      {booking.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="activity-time">
                    {new Date(
                      booking.createdAt || booking.date,
                    ).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed bookings table */}
      <div className="bookings-table-section">
        <h3>📊 Detailed bookings</h3>
        <div className="table-responsive">
          <table className="table table-striped bookings-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Event</th>
                <th>Category</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(bookingsByUser).length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No tickets booked in this period.
                  </td>
                </tr>
              ) : (
                Object.keys(bookingsByUser).map((userId) =>
                  bookingsByUser[userId].map((booking, idx) => {
                    const event = eventState.events.find(
                      (e) => e.id === booking.eventId,
                    );
                    return (
                      <tr key={`${userId}-${idx}`}>
                        <td>{userId}</td>
                        <td>{event ? event.title : "Unknown"}</td>
                        <td>
                          <span className="category-badge">
                            {event?.category || "N/A"}
                          </span>
                        </td>
                        <td>{booking.date}</td>
                        <td>{booking.quantity}</td>
                        <td>${booking.totalPrice?.toFixed(2) || "0.00"}</td>
                        <td>
                          <span
                            className={`status-badge ${booking.status === "cancelled" ? "cancelled" : ""}`}
                          >
                            {booking.status || "confirmed"}
                          </span>
                        </td>
                      </tr>
                    );
                  }),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;