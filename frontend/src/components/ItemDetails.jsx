import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ItemDetails({ user, onAddToCart, cart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchItemData = () => {
    fetch(`http://88.200.63.148:6361/api/items/${id}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Item not found');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItemData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://88.200.63.148:6361/api/items/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: newComment, user_id: user.id })
      });

      if (!res.ok) throw new Error('Failed to post comment.');
      
      setNewComment('');
      fetchItemData(); // Reload details and comments cleanly
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><h4>Loading item specifications...</h4></div>;
  if (error) return <div className="alert alert-danger mt-5 text-center">{error}</div>;

  const { item, comments } = data;

  return (
    <div className="row mt-4">
      {/* Item Profile */}
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm p-3">
          {item.image_url && (
            <img src={item.image_url} className="img-fluid rounded mb-3" alt={item.title} style={{ maxHeight: '400px', objectFit: 'cover' }} />
          )}
          <h2 className="fw-bold">{item.title}</h2>
          <h3 className="text-success fw-bold my-3">€{parseFloat(item.price).toFixed(2)}</h3>
          <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{item.description}</p>
          <hr />
          <div className="small text-secondary">
            Listed by: <strong className="text-dark">{item.username}</strong> on {new Date(item.created_at).toLocaleDateString()}
          </div>
          {/* Updated: Cart Operational Engine Hooks */}
{user && user.id !== item.user_id ? (
  cart.some(cartItem => cartItem.id === item.id) ? (
    <button className="btn btn-secondary btn-md w-100 mt-4 fw-bold shadow-sm" disabled>
      ✓ Already In Cart
    </button>
  ) : (
    <button 
      className="btn btn-outline-primary btn-md w-100 mt-4 fw-bold shadow-sm"
      onClick={() => onAddToCart(item)}
    >
      🛒 Add to Cart
    </button>
  )
) : user && user.id === item.user_id ? (
  <div className="alert alert-info small text-center mt-4 mb-0">
    You listed this device for sale.
  </div>
) : (
  <div className="alert alert-warning small text-center mt-4 mb-0">
    Please <Link to="/login">Log In</Link> to interact with listings.
  </div>
)}
          <button className="btn btn-outline-secondary btn-sm mt-4" onClick={() => navigate('/')}>← Back to Marketplace</button>
        </div>
      </div>

      {/* Comments Engine */}
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold mb-4">Discussion & Questions</h4>
          
          <div className="comments-box mb-4" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {comments.length === 0 ? (
              <p className="text-muted small italic text-center py-4">No questions asked yet about this device.</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="p-2 mb-2 bg-light rounded border-start border-primary border-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <strong>{c.username}</strong>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mb-0 small text-dark">{c.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Ask a question or leave a comment:</label>
                <textarea 
                  className="form-control form-control-sm" 
                  rows="3" 
                  placeholder="Is the battery capacity healthy? Are keys included?..." 
                  value={newComment} 
                  onChange={e => setNewComment(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100">Post Comment</button>
            </form>
          ) : (
            <div className="alert alert-warning small text-center">
              Please <Link to="/login">Log In</Link> to join the discussion.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}