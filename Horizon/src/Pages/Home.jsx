import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import { useWishlist } from "../context/WishlistContext";
import { useReviews } from "../context/ReviewContext";
import { useMemo, useState, useEffect } from "react";
import EventCard from "../Components/Common/EventCard";

function Home() {
  const { user } = useAuth();
  const { state } = useEvents();
  const { wishlist } = useWishlist();
  const { getAverageRating } = useReviews();
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const categories = [
    { name: "Movies", path: "/movies", icon: "🎬", color: "#e50914" },
    { name: "Plays", path: "/plays", icon: "🎭", color: "#ff6b6b" },
    { name: "Activities", path: "/activities", icon: "🎯", color: "#4ecdc4" },
    { name: "Shows", path: "/shows", icon: "🎤", color: "#ffe66d" },
    { name: "Resorts", path: "/resorts", icon: "🏨", color: "#95e1d3" },
  ];

  const categoryImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    ],
    [],
  );

  // Slow down hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % 5);
    }, 5000); // Change every 5 seconds instead of on load

    return () => clearInterval(interval);
  }, []);

  // Preload hero images
  useEffect(() => {
    categoryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [categoryImages]);

  const featuredEvents = useMemo(() => {
    return state.events
      .filter((event) => event.availableTickets > 0)
      .sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id))
      .slice(0, 6);
  }, [state.events, getAverageRating]);

  const trendingEvents = useMemo(() => {
    return state.events
      .filter((event) => event.availableTickets < event.totalTickets * 0.3)
      .slice(0, 4);
  }, [state.events]);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section-modern">
        <div className="hero-content">
          <div className="hero-badge">✨ Premium Event Booking Platform</div>
          <h1 className="hero-title">Horizon – Pass</h1>
          <p className="hero-subtitle">
            Book the show. Stay the night. Chase the Horizon.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{state.events.length}+</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
          <div className="hero-actions">
            {user ? (
              <>
                <Link className="btn btn-hero btn-primary" to="/movies">
                  Explore Events
                </Link>
                <Link className="btn btn-hero btn-outline" to="/wishlist">
                  My Wishlist
                </Link>
                <Link className="btn btn-hero btn-outline" to="/profile">
                  My Bookings
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-hero btn-primary" to="/register">
                  Get Started
                </Link>
                <Link className="btn btn-hero btn-outline" to="/login">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img
            src={categoryImages[heroImageIndex]}
            alt="Hero"
            className="hero-img"
          />
        </div>
      </div>

      {/* Welcome Message for Logged-in Users */}
      {user && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-icon">👋</span>
            <div>
              <h3>Welcome back, {user.name}!</h3>
              <p className="text-muted mb-0">
                {wishlist.length > 0 &&
                  `${wishlist.length} events in your wishlist • `}
                Ready to discover your next experience?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Tiles */}
      <section className="categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="category-tile-modern"
              style={{ "--category-color": category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
              <div className="category-count">
                {
                  state.events.filter(
                    (e) =>
                      e.category === category.name ||
                      (category.name === "Resorts" &&
                        e.category === "Resorts & Hotels"),
                  ).length
                }{" "}
                events
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Events</h2>
          <Link to="/movies" className="view-all-link">
            View All →
          </Link>
        </div>
        <div className="events-grid-modern">
          {featuredEvents.map((event) => (
            <div key={event.id} className="event-item-modern">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending / Selling Fast */}
      {trendingEvents.length > 0 && (
        <section className="trending-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Selling Fast</h2>
            <Link to="/movies" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="trending-grid">
            {trendingEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="trending-card"
              >
                <img src={event.imageUrl} alt={event.title} />
                <div className="trending-overlay">
                  <span className="trending-badge">Selling Fast</span>
                  <h4>{event.title}</h4>
                  <p className="trending-info">
                    {event.availableTickets} tickets left • ${event.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to create unforgettable memories?</h2>
          <p className="lead">
            Join thousands of users who trust Horizon Pass for their
            entertainment needs.
          </p>
          {!user && (
            <Link className="btn btn-cta" to="/register">
              Sign Up Now – It's Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
