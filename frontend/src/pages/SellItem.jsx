import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          image_url: imageUrl || null,
          user_id: user.id
        })
      });
      if (!response.ok) throw new Error('Failed to list item.');
      setSuccess('Item listed successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-7">
        <div className="card p-4 shadow-sm">
          <h3 className="mb-4 text-success fw-bold">Sell an Item</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleListItem}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Device Title</label>
              <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Price (€)</label>
                <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div className="col-md-8 mb-3">
                <label className="form-label fw-semibold">Image URL (Optional)</label>
                <input type="url" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100 mt-2">Submit Listing</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellItem;