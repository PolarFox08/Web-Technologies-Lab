import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BillCard from '../components/BillCard';

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Fetch all user bills on mount
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bills');
      setBills(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Could not load bills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError('');
      const res = await api.post('/bills', {
        title: title.trim(),
        description: description.trim(),
      });
      // Append new bill to state without page refresh (itemCount defaults to 0)
      const newBill = { ...res.data, itemCount: 0 };
      setBills((prev) => [newBill, ...prev]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create bill');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await api.delete(`/bills/${billId}`);
      // Remove deleted bill from local state
      setBills((prev) => prev.filter((bill) => bill._id !== billId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete bill');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>My Bills & Events</h2>
          <p className="subtitle">Manage and track your shopping expenses per event</p>
        </div>
      </div>

      {/* Create Bill Section */}
      <div className="create-bill-card">
        <h3>Create New Bill</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleCreateBill} className="create-bill-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Bill Title (e.g., Camping Trip, Weekly Groceries)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="item-input"
              required
            />
            <input
              type="text"
              placeholder="Description / Note (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="item-input"
            />
            <button type="submit" className="submit-btn" disabled={creating}>
              {creating ? 'Creating...' : '+ Create Bill'}
            </button>
          </div>
        </form>
      </div>

      {/* Bill List Grid */}
      {loading ? (
        <div className="loading-spinner">Loading your bills...</div>
      ) : bills.length === 0 ? (
        <p className="empty">No bills found. Create your first bill above!</p>
      ) : (
        <div className="bill-grid">
          {bills.map((bill) => (
            <BillCard key={bill._id} bill={bill} onDelete={handleDeleteBill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
