import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [billing, setBilling] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const fetchSweets = async () => {
    try {
      const res = await api.get('/api/sweets', {
        params: { q: search },
      });
      setSweets(res.data);
    } catch (err) {
      setError('Failed to load sweets');
    }
  };

  useEffect(() => {
    fetchSweets();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSweets();
  };

  const handleAddToCart = (sweet) => {
    if (sweet.quantity <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item._id === sweet._id);
      if (existing) {
        return prev.map(item =>
          item._id === sweet._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...sweet, qty: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (!billing.name || !billing.address || !billing.phone) {
      alert('Please fill billing details');
      return;
    }
    try {
      for (const item of cart) {
        for (let i = 0; i < item.qty; i++) {
          await api.post(`/api/sweets/${item._id}/purchase`);
        }
      }
      setCart([]);
      setBilling({ name: '', address: '', phone: '' });
      fetchSweets();
      alert('Order placed successfully!');
    } catch (err) {
      alert('Checkout failed');
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="app-shell">
      <h1 className="page-title">Sweets Dashboard</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          className="search-input"
          placeholder="Search sweets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="primary-btn">
          Search
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="sweets-grid">
        {sweets.map(sweet => (
          <div className="sweet-card" key={sweet._id}>
            <h3 className="sweet-name">
              {sweet.category === 'chocolate' ? '🍫 ' : '🍬 '}
              {sweet.name}
            </h3>
            <p className="sweet-meta">Category: {sweet.category}</p>
            <p className="sweet-meta">Price: ₹{sweet.price}</p>
            <p className="sweet-meta">Stock: {sweet.quantity}</p>
            <button
              onClick={() => handleAddToCart(sweet)}
              disabled={sweet.quantity <= 0}
              className={sweet.quantity <= 0 ? 'btn-disabled' : 'btn-purchase'}
            >
              {sweet.quantity <= 0 ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
        ))}
      </div>

      <div className="cart-panel">
        <h2>My Cart</h2>
        {cart.length === 0 && <p>No items in cart.</p>}

        {cart.map(item => (
          <div key={item._id} className="cart-row">
            <span>{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <p className="cart-total">Total: ₹{cartTotal}</p>

            <h3>Billing details</h3>
            <input
              className="billing-input"
              placeholder="Full name"
              value={billing.name}
              onChange={e => setBilling({ ...billing, name: e.target.value })}
            />
            <input
              className="billing-input"
              placeholder="Address"
              value={billing.address}
              onChange={e => setBilling({ ...billing, address: e.target.value })}
            />
            <input
              className="billing-input"
              placeholder="Phone"
              value={billing.phone}
              onChange={e => setBilling({ ...billing, phone: e.target.value })}
            />

            <button
              onClick={handleCheckout}
              className="primary-btn"
              style={{ marginTop: 12 }}
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
