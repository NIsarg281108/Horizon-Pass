import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useEvents } from "../Context/EventContext";
import { useWishlist } from "../Context/WishlistContext";
import { useReviews } from "../Context/ReviewContext";
import EventCard from "../Components/Common/EventCard";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600",
];

const CATEGORIES = [
  { name: "Movies", path: "/movies", icon: "🎬", color: "#e50914", match: "Movies" },
  { name: "Plays", path: "/plays", icon: "🎭", color: "#ff6b6b", match: "Plays" },
  { name: "Activities", path: "/activities", icon: "🎯", color: "#4ecdc4", match: "Activities" },
  { name: "Shows", path: "/shows", icon: "🎤", color: "#ffe66d", match: "Shows" },
  { name: "Resorts", path: "/resorts", icon: "🏨", color: "#95e1d3", match: "Resorts & Hotels" },
];

function Home() {
  const { user } = useAuth();
  const { state } = useEvents();
  const { wishlist } = useWishlist();
  const { getAverageRating } = useReviews();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    // Preload hero images so the crossfade is smooth
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const featuredEvents = useMemo(
    () =>
      state.events
        .filter((event) => event.availableTickets > 0)
        .sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id))
        .slice(0, 6),
    [state.events, getAverageRating],
  );

  const trendingEvents = useMemo(
    () =>
      state.events
        .filter(
          (event) =>
            event.availableTickets > 0 &&
            event.availableTickets < event.totalTickets * 0.3,
        )
        .slice(0, 4),
    [state.events],
  );

  const countFor = (match) =>
    state.events.filter((event) => event.category === match).length;

  return (
    <div>
      {/* Hero */}
      <section className="hero-section-modern">
        <div className="hero-slides" aria-hidden="true">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`hero-slide ${i === heroIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-badge">✨ Horizon – Pass</span>
          <h1 className="hero-title">
            Book the show. <span>Stay the night.</span>
          </h1>
          <p className="hero-subtitle">
            Chase the Horizon: movies, plays, shows, activities and resorts,
            all in one place.
          </p>

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

          <div className="hero-stats">
            <div>
              <div className="stat-number">{state.events.length}+</div>
              <div className="stat-label">Events</div>
            </div>
            <div>
              <div className="stat-number">{CATEGORIES.length}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome banner */}
      {user && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-icon">👋</span>
            <div>
              <h3>Welcome back, {user.name}!</h3>
              <p className="text-muted mb-0">
                {wishlist.length > 0 &&
                  `${wishlist.length} event${wishlist.length === 1 ? "" : "s"} in your wishlist • `}
                Ready to discover your next experience?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="category-tile-modern"
              style={{ "--category-color": category.color }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">
                {countFor(category.match)} events
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Events</h2>
          <Link to="/movies" className="view-all-link">
            View all →
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

      {/* Selling fast */}
      {trendingEvents.length > 0 && (
        <section className="trending-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Selling Fast</h2>
          </div>
          <div className="trending-grid">
            {trendingEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="trending-card"
              >
                <img src={event.imageUrl} alt={event.title} loading="lazy" />
                <div className="trending-overlay">
                  <span className="trending-badge">Selling fast</span>
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

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <h2>Ready to create unforgettable memories?</h2>
          <p className="lead">
            Join thousands of people who trust Horizon – Pass for their
            entertainment.
          </p>
          <Link className="btn btn-cta" to="/register">
            Sign up, it's free
          </Link>
        </section>
      )}
    </div>
  );
}

export default Home;