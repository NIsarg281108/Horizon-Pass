import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../Context/AuthContext';
import { useTheme } from '../../Context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-horizon">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Horizon – Pass
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/movies">Movies</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/plays">Plays</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/shows">Shows</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/resorts">Resorts</Link>
                </li>
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="adminDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Admin
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                        <li><Link className="dropdown-item" to="/admin">Dashboard</Link></li>
                        <li><Link className="dropdown-item" to="/admin/add-event">Add Event</Link></li>
                        <li><Link className="dropdown-item" to="/admin/manage-events">Manage Events</Link></li>
                        <li><Link className="dropdown-item" to="/admin/manage-users">Manage Users</Link></li>
                        <li><Link className="dropdown-item" to="/admin/bookings">Manage Bookings</Link></li>
                      </ul>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* Show search form only when user is logged in */}
          {user && (
            <form className="d-flex mx-2 my-2 my-lg-0" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '200px' }}
              />
              <button className="btn btn-outline-light" type="submit">Search</button>
            </form>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <button className="btn btn-outline-light me-2" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">{user.name}</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/register">Register</Link>
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