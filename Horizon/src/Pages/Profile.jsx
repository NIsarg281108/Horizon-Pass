import { useState, useMemo } from "react";
import { useAuth } from "../Context/AuthContext";
import { useBookings } from "../Context/BookingContext";
import { useWishlist } from "../Context/WishlistContext";
import { useEvents } from "../Context/EventContext";
import { useReviews } from "../Context/ReviewContext";
import { Link } from "react-router";
import EventCard from "../Components/Common/EventCard";
import AccountSettings from "../Components/Profile/AccountSettings";
import FoodOrderModal from "../Components/Profile/FoodOrderModal";
import PrintableTicket from "../Components/Profile/PrintableTicket";
import { cancelBookingAndRelease } from "../Utils/bookingActions";

function Profile() {
  const { user } = useAuth();
  const { state: bookingState, dispatch: bookingDispatch } = useBookings();
  const { wishlist } = useWishlist();
  const { state: eventState, dispatch: eventDispatch } = useEvents();
  const { getReviewsForEvent } = useReviews();
  const [activeTab, setActiveTab] = useState("overview");
  const [orderingBookingId, setOrderingBookingId] = useState(null);
  const [ticketBooking, setTicketBooking] = useState(null);

  const favoriteEvents = useMemo(
    () => eventState.events.filter((event) => wishlist.includes(event.id)),
    [eventState.events, wishlist],
  );

  const userBookings = useMemo(
    () => bookingState.bookings.filter((b) => b.userId === user?.id),
    [bookingState.bookings, user?.id],
  );

  const stats = useMemo(() => {
    const totalBookings = userBookings.length;
    const totalSpent = userBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );
    const upcomingBookings = userBookings.filter(
      (b) => b.status === "confirmed" && new Date(b.date) > new Date(),
    ).length;
    const completedBookings = userBookings.filter(
      (b) => b.status === "confirmed" && new Date(b.date) <= new Date(),
    ).length;
    const reviewsCount = userBookings.reduce(
      (count, b) =>
        count +
        getReviewsForEvent(b.eventId).filter((r) => r.userId === user?.id)
          .length,
      0,
    );

    return {
      totalBookings,
      totalSpent,
      upcomingBookings,
      completedBookings,
      reviewsCount,
      favoriteCount: favoriteEvents.length,
    };
  }, [userBookings, favoriteEvents, getReviewsForEvent, user?.id]);

  // Registered users get a timestamp as their id, demo accounts get small ids
  const memberSince = useMemo(() => {
    const timestamp = Number(user?.id);
    if (Number.isFinite(timestamp) && timestamp > 1e12) {
      return new Date(timestamp).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    }
    return "Demo account";
  }, [user?.id]);

  // Most common categories from bookings and wishlist
  const favoriteCategories = useMemo(() => {
    const counts = {};
    const add = (category) => {
      if (category) counts[category] = (counts[category] || 0) + 1;
    };
    userBookings.forEach((b) => add(b.category));
    favoriteEvents.forEach((e) => add(e.category));

    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([category]) => category);

    return top.length ? top.join(", ") : "None yet";
  }, [userBookings, favoriteEvents]);

  const handleCancelBooking = (booking) => {
    if (window.confirm("Cancel this booking? Its tickets will be released.")) {
      cancelBookingAndRelease(bookingDispatch, eventDispatch, booking);
    }
  };

  if (!user) {
    return (
      <div className="profile-login-prompt">
        <div className="login-prompt-content">
          <h3>Please login to view your profile</h3>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <span
            className={`profile-role ${user.role === "admin" ? "admin" : "user"}`}
          >
            {user.role === "admin" ? "👑 Admin" : "👤 User"}
          </span>
        </div>
        <div className="profile-actions">
          <Link to="/wishlist" className="btn btn-outline-primary">
            ❤️ Wishlist ({stats.favoriteCount})
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">${stats.totalSpent.toFixed(2)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.upcomingBookings}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-number">{stats.reviewsCount}</div>
            <div className="stat-label">Reviews Given</div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          🎫 My Bookings
        </button>
        <button
          className={`tab-button ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          ❤️ Favorites ({stats.favoriteCount})
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <h2>Account Overview</h2>

            <div className="info-grid">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">
                    {user.phone || "Not provided"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">
                    {user.dob || "Not provided"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">
                    {user.age !== undefined
                      ? `${user.age} years`
                      : "Not provided"}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <h3>Account Activity</h3>
                <div className="info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">{memberSince}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Type</span>
                  <span className="info-value">
                    {user.role === "admin" ? "Administrator" : "Standard User"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Events Attended</span>
                  <span className="info-value">{stats.completedBookings}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Favorite Categories</span>
                  <span className="info-value">{favoriteCategories}</span>
                </div>
              </div>
            </div>

            {userBookings.length > 0 && (
              <div className="recent-bookings">
                <h3>Recent Bookings</h3>
                <div className="bookings-list">
                  {userBookings.slice(0, 3).map((booking) => (
                    <Link
                      key={booking.id}
                      to={`/event/${booking.eventId}`}
                      className="booking-item"
                    >
                      <img
                        src={booking.imageUrl}
                        alt={booking.title}
                        className="booking-thumb"
                      />
                      <div className="booking-details">
                        <strong>{booking.title}</strong>
                        <p className="booking-meta">
                          {booking.venue} • {booking.date}
                        </p>
                        <span className={`booking-status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-price">
                        ${booking.totalPrice?.toFixed(2) || "0.00"}
                      </div>
                    </Link>
                  ))}
                </div>
                {userBookings.length > 3 && (
                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => setActiveTab("bookings")}
                  >
                    View all bookings
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-section">
            <h2>My Bookings</h2>
            {userBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎫</div>
                <h3>No bookings yet</h3>
                <p className="text-muted">
                  Start exploring events and make your first booking!
                </p>
                <Link to="/movies" className="btn btn-primary">
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="bookings-grid">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="booking-card-wrap">
                    <Link
                      to={`/event/${booking.eventId}`}
                      className="booking-card"
                    >
                      <img
                        src={booking.imageUrl}
                        alt={booking.title}
                        className="booking-image"
                      />
                      <div className="booking-info">
                        <h4>{booking.title}</h4>
                        <p className="booking-venue">{booking.venue}</p>
                        <div className="booking-meta">
                          <span>📅 {booking.date}</span>
                          <span>⏰ {booking.time}</span>
                        </div>
                        <div className="booking-tier">
                          <span className="tier-badge">{booking.tier}</span>
                          <span className="quantity">x{booking.quantity}</span>
                        </div>
                        {booking.seats?.length > 0 && (
                          <p className="booking-seats">
                            Seats: {booking.seats.join(", ")}
                          </p>
                        )}
                        <div className="booking-footer">
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                          <span className="price">
                            ${booking.totalPrice?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {booking.status === "confirmed" && (
                      <div className="booking-actions">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setTicketBooking(booking)}
                        >
                          🎟 Ticket
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setOrderingBookingId(booking.id)}
                        >
                          🍿 Order food
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {booking.foodOrders && booking.foodOrders.length > 0 && (
                      <p className="text-muted small mt-2 mb-0">
                        {booking.foodOrders.length} food order
                        {booking.foodOrders.length === 1 ? "" : "s"} placed
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="favorites-section">
            <h2>My Favorites</h2>
            {favoriteEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>No favorites yet</h3>
                <p className="text-muted">
                  Start saving events you're interested in!
                </p>
                <Link to="/movies" className="btn btn-primary">
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="favorites-grid">
                {favoriteEvents.map((event) => (
                  <div key={event.id} className="favorite-item">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && <AccountSettings />}
      </div>

      {orderingBookingId && (
        <FoodOrderModal
          bookingId={orderingBookingId}
          onClose={() => setOrderingBookingId(null)}
        />
      )}

      {ticketBooking && (
        <PrintableTicket
          booking={ticketBooking}
          onClose={() => setTicketBooking(null)}
        />
      )}
    </div>
  );
}

export default Profile;