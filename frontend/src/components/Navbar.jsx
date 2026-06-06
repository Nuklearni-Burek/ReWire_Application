import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout, cartCount, theme, onToggleTheme }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">ReWire</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {(!user || user.role !== 'admin') && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Marketplace</Link></li>

                {user && user.role === 'standard' && (
                  <li className="nav-item">
                    <Link className="nav-link position-relative text-info fw-semibold" to="/cart">
                      Cart 🛒
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                <li className="nav-item"><Link className="nav-link" to="/calendar">Holidays</Link></li>

                {user && user.role === 'standard' && (
                  <li className="nav-item">
                    <Link className="btn btn-outline-success btn-sm mt-1 ms-2" to="/sell">Sell an item</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <button
            onClick={onToggleTheme}
            className={`btn btn-sm me-3 ${theme === 'dark' ? 'btn-outline-warning' : 'btn-outline-secondary'}`}
            type="button"
          >
            {theme === 'dark' ? '☀️ Bright Mode' : '🌙 Dark Mode'}
          </button>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="navbar-text me-3 text-light">
                  Hello, <strong className="text-info">{user.username}</strong>
                </span>
                <button
                  onClick={() => { onLogout(); navigate('/login'); }}
                  className="btn btn-sm btn-danger"
                >
                  Log Out
                </button>
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