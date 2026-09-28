import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";
import { useWishlist } from "../../Context/WishlistContext";
import { useEvents } from "../../Context/EventContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { state } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
      setSearchExpanded(false);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    return state.events
      .filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query),
      )
      .slice(0, 5);
  }, [searchQuery, state.events]);

  const handleSuggestionClick = (event) => {
    navigate(`/event/${event.id}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setSearchExpanded(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest(".navbar")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-horizon">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">🎭</span>
          <span className="brand-text">Horizon – Pass</span>
        </Link>

        {/* Mobile Quick Actions */}
        <div className="mobile-quick-actions d-lg-none">
          {user && (
            <Link className="quick-action-btn" to="/wishlist">
              ❤️
              {wishlist.length > 0 && (
                <span className="action-badge">{wishlist.length}</span>
              )}
            </Link>
          )}
          <button className="quick-action-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Desktop Menu */}
        <div
          className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`}
          id="mainNav"
        >
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/movies"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🎬</span> Movies
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/plays"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🎭</span> Plays
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/activities"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🎯</span> Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/shows"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🎤</span> Shows
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/resorts"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🏨</span> Resorts
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="adminDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="nav-icon">👑</span> Admin
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="adminDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/add-event"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Add Event
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/manage-events"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Manage Events
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/manage-users"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Manage Users
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/bookings"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Manage Bookings
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Search */}
          {user && (
            <div
              className={`search-container ${searchExpanded ? "expanded" : ""}`}
            >
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                <button
                  className="search-toggle"
                  type="button"
                  onClick={() => setSearchExpanded(!searchExpanded)}
                >
                  🔍
                </button>
                <button className="search-submit" type="submit">
                  Search
                </button>
              </form>

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((event) => (
                    <div
                      key={event.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(event)}
                    >
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="suggestion-image"
                      />
                      <div className="suggestion-info">
                        <div className="suggestion-title">{event.title}</div>
                        <div className="suggestion-meta">
                          {event.category} • {event.venue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item d-none d-lg-block">
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </li>
            {user ? (
              <>
                <li className="nav-item d-none d-lg-block">
                  <Link
                    className="nav-link position-relative wishlist-link"
                    to="/wishlist"
                  >
                    ❤️ Wishlist
                    {wishlist.length > 0 && (
                      <span className="wishlist-badge">{wishlist.length}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <div className="user-menu dropdown">
                    <button
                      className="btn btn-user dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <span className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="user-name d-none d-lg-inline">
                        {user.name}
                      </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          👤 Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/wishlist"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          ❤️ Wishlist
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={logout}>
                          🚪 Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-light me-2"
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-primary"
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
