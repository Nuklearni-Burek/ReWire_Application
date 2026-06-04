import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">ReWire</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Marketplace</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">Holidays Calendar</Link>
            </li>
            
            {/* Show 'Sell an item' only if logged in as a standard user */}
            {user && user.role === 'standard' && (
              <li className="nav-item">
                <Link className="btn btn-outline-success btn-sm mt-1 ms-2" to="/sell">Sell an item</Link>
              </li>
            )}

            {/* Show Admin Dashboard button exclusively to the admin */}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/admin">Admin Dashboard</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="navbar-text me-3 text-light">
                  Hello, <strong className="text-info">{user.username}</strong> ({user.role})
                </span>
                <button onClick={handleLogoutClick} className="btn btn-sm btn-danger">Log Out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-light me-2" to="/login">Login</Link>
                <Link className="btn btn-sm btn-primary" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;