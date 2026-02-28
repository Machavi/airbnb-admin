// ===========================================
// Header Component - Top navigation bar
// ===========================================
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Check if user is logged in on mount and when localStorage changes
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();

    // Listen for storage changes
    window.addEventListener('storage', checkUser);
    // Custom event for login/logout within same tab
    window.addEventListener('authChange', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('authChange', checkUser);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Airbnb Logo */}
        <Link to="/dashboard" className="logo">
          <svg width="102" height="32" fill="#FF5A5F" viewBox="0 0 1000 1000">
            <path d="M228.5 462.7c0-24-17.5-43.2-43.2-43.2-25.7 0-43.2 19.2-43.2 43.2 0 24 17.5 43.2 43.2 43.2 25.7 0 43.2-19.2 43.2-43.2zm-117.3 0c0-42.3 30.6-72.4 74.1-72.4s74.1 30.1 74.1 72.4c0 42.3-30.6 72.4-74.1 72.4s-74.1-30.1-74.1-72.4zm593.5 0c0-24-17.5-43.2-43.2-43.2-25.7 0-43.2 19.2-43.2 43.2 0 24 17.5 43.2 43.2 43.2 25.7 0 43.2-19.2 43.2-43.2zm-117.4 0c0-42.3 30.6-72.4 74.1-72.4s74.1 30.1 74.1 72.4c0 42.3-30.6 72.4-74.1 72.4-43.4 0-74.1-30.1-74.1-72.4zM520 505.9c-25.7 0-43.2-19.2-43.2-43.2 0-24 17.5-43.2 43.2-43.2 25.7 0 43.2 19.2 43.2 43.2 0 24-17.5 43.2-43.2 43.2zm0-115.6c-43.5 0-74.1 30.1-74.1 72.4 0 42.3 30.6 72.4 74.1 72.4s74.1-30.1 74.1-72.4c0-42.3-30.6-72.4-74.1-72.4z"/>
          </svg>
          <span className="logo-text">airbnb</span>
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Listings</Link>
              <Link to="/create-listing" className="nav-link">Create Listing</Link>
            </>
          ) : null}
        </nav>

        {/* Profile Section */}
        <div className="header-profile" ref={dropdownRef}>
          {user ? (
            <>
              {/* Profile Icon with Greeting */}
              <button className="profile-btn" onClick={toggleDropdown}>
                <div className="profile-icon">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="greeting">Hi, {user.username || 'User'}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/reservations"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Reservations
                  </Link>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Listings
                  </Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* When logged out - show Become a host and Login */}
              <Link to="/login" className="nav-link become-host">Become a host</Link>
              <Link to="/login" className="login-btn">Log in</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
