import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Authentication State
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          {/* Marketplace / Feed (Placeholder for Step 2/5) */}
          <Route path="/" element={
            <div className="text-center mt-5">
              <h2>Marketplace Public Feed</h2>
              <p className="lead">Items will be displayed here dynamically.</p>
            </div>
          } />

          {/* Authentication Routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          {/* Placeholders for upcoming modules */}
          <Route path="/sell" element={user?.role === 'standard' ? <div>Sell Form Placeholder</div> : <Navigate to="/login" />} />
          <Route path="/calendar" element={<div>Calendar Placeholder</div>} />
          <Route path="/admin" element={user?.role === 'admin' ? <div>Admin Panel Dashboard</div> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;