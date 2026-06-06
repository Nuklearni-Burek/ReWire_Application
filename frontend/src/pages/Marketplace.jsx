import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date-desc');

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

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'date-asc') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'date-desc') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  if (loading) return <div className="text-center mt-5"><h4>Loading marketplace offers...</h4></div>;

  return (
    <div>
      <h2 className="mb-4 fw-bold">Available Electronic Devices</h2>
      <div className="row mb-4">
        <div className="col-md-3 ms-auto">
          <label className="form-label small fw-bold text-muted">Sort Listings By:</label>
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="alert alert-secondary text-center">No items listed for sale right now. Be the first to list one!</div>
      ) : (
        <div className="row">
          {sortedItems.map(item => (
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

export default Marketplace;