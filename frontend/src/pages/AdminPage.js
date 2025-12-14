import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function AdminPage() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [error, setError] = useState('');

  const fetchSweets = async () => {
    try {
      const res = await api.get('/api/sweets');
      setSweets(res.data);
    } catch {
      setError('Failed to load sweets');
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/sweets', {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      setForm({ name: '', category: '', price: '', quantity: '' });
      fetchSweets();
    } catch {
      setError('Create failed (admin only)');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/sweets/${id}`);
      fetchSweets();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="app-shell">
      <h1 className="page-title">Admin – Manage Sweets</h1>

      <form onSubmit={handleCreate} className="search-bar">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="search-input"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="search-input"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="search-input"
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="search-input"
        />
        <button type="submit" className="primary-btn">
          Add Sweet
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <ul>
        {sweets.map((s) => (
          <li key={s._id}>
            {s.name} – {s.category} – ₹{s.price} – qty {s.quantity}
            <button
              style={{ marginLeft: 8 }}
              onClick={() => handleDelete(s._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
