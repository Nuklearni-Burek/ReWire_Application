import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

// --- NESTED NAVBAR COMPONENT ---
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">ReWire</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Marketplace</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/calendar">Holidays</Link></li>
            {user && user.role === 'standard' && (
              <li className="nav-item"><Link className="btn btn-outline-success btn-sm mt-1 ms-2" to="/sell">Sell an item</Link></li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item"><Link className="nav-link text-warning fw-bold" to="/admin">Admin Dashboard</Link></li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="navbar-text me-3 text-light">Hello, <strong className="text-info">{user.username}</strong></span>
                <button onClick={() => { onLogout(); navigate('/login'); }} className="btn btn-sm btn-danger">Log Out</button>
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

// --- NESTED REGISTER COMPONENT ---
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch('http://88.200.63.148:6361/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="row justify-content-center mt-5"><div className="col-md-5"><div className="card p-4 shadow">
      <h3>Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3"><label className="form-label">Username</label><input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required /></div>
        <div className="mb-3"><label className="form-label">Password</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        <div className="mb-3"><label className="form-label">Confirm Password</label><input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div></div></div>
  );
}

// --- NESTED LOGIN COMPONENT ---
function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://88.200.63.148:6361/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLoginSuccess(data.user);
      navigate('/');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="row justify-content-center mt-5"><div className="col-md-5"><div className="card p-4 shadow">
      <h3>Log In</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3"><label className="form-label">Username</label><input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required /></div>
        <div className="mb-3"><label className="form-label">Password</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        <button type="submit" className="btn btn-dark w-100">Log In</button>
      </form>
    </div></div></div>
  );
}

// --- MAIN APP WORKSPACE ---
function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Navbar user={user} onLogout={() => setUser(null)} />
      <div className="container">
        <Routes>
          <Route path="/" element={<div className="text-center mt-5"><h2>ReWire Marketplace</h2><p>Authentication system is fully operational!</p></div>} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/sell" element={user?.role === 'standard' ? <div>Sell Form</div> : <Navigate to="/login" />} />
          <Route path="/calendar" element={<div>Calendar</div>} />
          <Route path="/admin" element={user?.role === 'admin' ? <div>Admin Panel</div> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;