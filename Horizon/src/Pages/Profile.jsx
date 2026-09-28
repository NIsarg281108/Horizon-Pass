import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useWishlist } from "../context/WishlistContext";
import { useEvents } from "../context/EventContext";
import { useReviews } from "../context/ReviewContext";
import { Link } from "react-router";
import EventCard from "../Components/Common/EventCard";

function Profile() {
  const { user } = useAuth();
  const { state: bookingState } = useBookings();
  const { wishlist } = useWishlist();
  const { state: eventState } = useEvents();
  const { getReviewsForEvent } = useReviews();
  const [activeTab, setActiveTab] = useState("overview");

  const favoriteEvents = eventState.events.filter((event) =>
    wishlist.includes(event.id),
  );
  const userBookings = bookingState.bookings.filter(
    (b) => b.userId === user?.id,
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

      {/* Stats Grid */}
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

      {/* Profile Tabs */}
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

      {/* Tab Content */}
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
                  <span className="info-value">January 2025</span>
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
                  <span className="info-value">Movies, Plays</span>
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
                    View All Bookings
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
                  <Link
                    key={booking.id}
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

        {activeTab === "settings" && (
          <div className="settings-section">
            <h2>Profile Settings</h2>
            <div className="settings-card">
              <h3>Account Settings</h3>
              <p className="text-muted mb-4">
                Manage your account preferences and security settings.
              </p>

              <div className="settings-item">
                <div className="settings-info">
                  <strong>Change Password</strong>
                  <p className="text-muted mb-0">
                    Update your password to keep your account secure
                  </p>
                </div>
                <button className="btn btn-outline-primary">Change</button>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <strong>Email Notifications</strong>
                  <p className="text-muted mb-0">
                    Manage your email notification preferences
                  </p>
                </div>
                <button className="btn btn-outline-primary">Configure</button>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <strong>Privacy Settings</strong>
                  <p className="text-muted mb-0">
                    Control your privacy and data settings
                  </p>
                </div>
                <button className="btn btn-outline-primary">Manage</button>
              </div>

              <div className="settings-item danger">
                <div className="settings-info">
                  <strong>Delete Account</strong>
                  <p className="text-muted mb-0">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
