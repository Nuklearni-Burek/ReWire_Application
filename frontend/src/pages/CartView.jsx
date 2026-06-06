import React from 'react';
import { useNavigate } from 'react-router-dom';

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

export default CartView;