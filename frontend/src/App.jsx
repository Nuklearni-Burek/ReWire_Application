import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import ItemDetails from './components/ItemDetails.jsx';

// --- NESTED NAVBAR COMPONENT ---
function Navbar({ user, onLogout, cartCount }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">ReWire</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Marketplace</Link></li>
            
            {/* Added Cart Navigation Tab exactly between Marketplace and Holidays */}
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

// --- LIVE MARKETPLACE LANDING FEED ---
function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://88.200.63.148:6361/api/items', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5"><h4>Loading marketplace offers...</h4></div>;

  return (
    <div>
      <h2 className="mb-4 fw-bold">Available Electronic Devices</h2>
      {items.length === 0 ? (
        <div className="alert alert-secondary text-center">No items listed for sale right now. Be the first to list one!</div>
      ) : (
        <div className="row">
          {items.map(item => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm">
                {item.image_url && (
                  <img src={item.image_url} className="card-img-top" alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-truncate">{item.title}</h5>
                  <p className="text-success fw-bold fs-5 mb-1">€{parseFloat(item.price).toFixed(2)}</p>
                  <p className="card-text text-muted text-truncate small">{item.description}</p>
                  <p className="card-text mt-auto mb-2 small text-secondary">Seller: <strong>{item.username}</strong></p>
                  <Link to={`/items/${item.id}`} className="btn btn-outline-primary btn-sm w-100 mt-2">View Details & Comments</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- NEW COMPREHENSIVE CART COMPONENT ---
function CartView({ user, cart, onRemoveItem, onClearCart }) {
  const navigate = useNavigate();
  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const fullName = e.target.fullName.value;
    const creditCard = e.target.creditCard.value;
    const shippingLocation = e.target.shippingLocation.value;

    try {
      // Loop and process individual entries due to your unique 1:1 item purchase structure
      for (const item of cart) {
        const res = await fetch(`http://88.200.63.148:6361/api/items/${item.id}/buy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            user_id: user.id,
            full_name: fullName,
            credit_card: creditCard,
            shipping_location: shippingLocation
          })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Transaction failed for item: ${item.title}`);
      }

      alert('🎉 Purchase successful! All items in your cart have been ordered.');
      onClearCart();
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="row mt-4">
      <div className="col-md-7 mb-4">
        <div className="card p-4 shadow-sm">
          <h3 className="fw-bold mb-4">Your Shopping Cart 🛒</h3>
          {cart.length === 0 ? (
            <div className="alert alert-secondary text-center py-4">Your cart is empty. Explore the marketplace to add items!</div>
          ) : (
            <div className="list-group">
              {cart.map(item => (
                <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-light mb-2 rounded border">
                  <div>
                    <h6 className="fw-bold mb-1">{item.title}</h6>
                    <span className="text-success fw-bold">€{parseFloat(item.price).toFixed(2)}</span>
                  </div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => onRemoveItem(item.id)}>Remove</button>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mt-3 p-2 border-top">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-4 fw-bold text-success">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="col-md-5">
          <div className="card p-4 shadow-sm bg-dark text-light">
            <h4 className="fw-bold mb-3">Delivery & Checkout</h4>
            <form onSubmit={handleCheckoutSubmit}>
              <div className="mb-2">
                <label className="form-label small mb-1">Full Name</label>
                <input type="text" name="fullName" className="form-control form-control-sm" required />
              </div>
              <div className="mb-2">
                <label className="form-label small mb-1">Credit Card Number</label>
                <input type="text" name="creditCard" className="form-control form-control-sm" required />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Shipping Address</label>
                <input type="text" name="shippingLocation" className="form-control form-control-sm" required />
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold">Place Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REGISTER COMPONENT ---
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
        credentials: 'include',
        body: JSON.stringify({ username, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } 
    catch (err) { setError(err.message); }
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

// --- LOGIN COMPONENT ---
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
        credentials: 'include',
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

// --- SELL ITEM COMPONENT ---
function SellItem({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleListItem = async (e) => {
    e.preventDefault();
    if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) {
      setError('Please enter a valid price greater than 0.');
      return;
    }
    try {
      const response = await fetch('http://88.200.63.148:6361/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, description, price: parseFloat(price), image_url: imageUrl || null, user_id: user.id })
      });
      if (!response.ok) throw new Error('Failed to list item.');
      setSuccess('Item listed successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="row justify-content-center mt-4"><div className="col-md-7"><div className="card p-4 shadow-sm">
      <h3 className="mb-4 text-success fw-bold">Sell an Item</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleListItem}>
        <div className="mb-3"><label className="form-label fw-semibold">Device Title</label><input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required /></div>
        <div className="mb-3"><label className="form-label fw-semibold">Description</label><textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} required /></div>
        <div className="row">
          <div className="col-md-4 mb-3"><label className="form-label fw-semibold">Price (€)</label><input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required /></div>
          <div className="col-md-8 mb-3"><label className="form-label fw-semibold">Image URL (Optional)</label><input type="url" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
        </div>
        <button type="submit" className="btn btn-success w-100 mt-2">Submit Listing</button>
      </form>
    </div></div></div>
  );
}

// --- MAIN CONTROL ENVIRONMENT WITH INTEGRATED CART STATE MAPPING ---
function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // Master Cart State Array
  const [loading, setLoading] = useState(true);

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
      <Navbar user={user} onLogout={handleLogout} cartCount={cart.length} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/cart" element={user?.role === 'standard' ? <CartView user={user} cart={cart} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} /> : <Navigate to="/login" />} />
          <Route path="/items/:id" element={<ItemDetails user={user} onAddToCart={handleAddToCart} cart={cart} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/sell" element={user?.role === 'standard' ? <SellItem user={user} /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={<div>Calendar View Placeholder</div>} />
          <Route path="/admin" element={user?.role === 'admin' ? <div>Admin Panel Dashboard</div> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;