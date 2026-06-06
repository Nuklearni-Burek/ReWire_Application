import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import ItemDetails from './components/ItemDetails.jsx';
import Calendar from './components/Calendar.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx'; 
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Marketplace from './pages/Marketplace.jsx';
import CartView from './pages/CartView.jsx';
import SellItem from './pages/SellItem.jsx';



// --- MAIN CONTROL ENVIRONMENT WITH INTEGRATED CART STATE MAPPING ---
function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // Master Cart State Array
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light'); // Initial baseline state

  useEffect(() => {
    fetch('http://88.200.63.148:6361/api/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
 //za toggle dark/bright mode
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);


  const handleAddToCart = (item) => {
    // Check if item is already in cart to prevent duplicates
    if (cart.some(cartItem => cartItem.id === item.id)) {
      alert("This unique item is already in your cart!");
      return;
    }
    setCart([...cart, item]);
    alert(`${item.title} added to your cart!`);
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const toggleTheme = () => {
  setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
};

  const handleClearCart = () => setCart([]);
  const handleLogout = async () => {
    try {
      await fetch('http://88.200.63.148:6361/api/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
      setCart([]);
    } catch (err) { console.error("Logout failed", err); }
  };

  if (loading) return <div className="text-center mt-5"><h4>Verifying session secure channels...</h4></div>;

  return (
    <Router>
     <Navbar user={user} onLogout={handleLogout} cartCount={cart.length} theme={theme} onToggleTheme={toggleTheme} />      <div className="container">
        <Routes>
  <Route path="/" element={user?.role === 'admin' ? <AdminDashboard /> : <Marketplace />} />
  <Route path="/cart" element={user?.role === 'standard' ? <CartView user={user} cart={cart} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} /> : <Navigate to="/login" />} />
  
  {/* Protect Item Details and Calendar from Admin role exploration */}
  <Route path="/items/:id" element={user?.role === 'admin' ? <Navigate to="/" /> : <ItemDetails user={user} onAddToCart={handleAddToCart} cart={cart} />} />
  <Route path="/calendar" element={user?.role === 'admin' ? <Navigate to="/" /> : <Calendar />} />
  
  <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={setUser} />} />
  <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
  <Route path="/sell" element={user?.role === 'standard' ? <SellItem user={user} /> : <Navigate to="/login" />} />
</Routes>
      </div>
    </Router>
  );
}

export default App;