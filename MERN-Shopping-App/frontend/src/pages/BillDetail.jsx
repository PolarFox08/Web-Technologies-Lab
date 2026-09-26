import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ItemRow from '../components/ItemRow';
import AddItemForm from '../components/AddItemForm';

const BillDetail = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  // Fetch bill details on mount or ID change
  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setError('');
        const res = await api.get(`/bills/${billId}`);
        setBill(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.error || 'Failed to load bill');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [billId]);

  // Append new item to local bill.items state
  const handleAddItem = async ({ name, quantity }) => {
    const res = await api.post(`/bills/${billId}/items`, { name, quantity });
    const addedItem = res.data;
    setBill((prev) => ({
      ...prev,
      items: [...prev.items, addedItem],
    }));
  };

  // Toggle purchased state for a subitem
  const handleToggleItem = async (itemId) => {
    try {
      const res = await api.put(`/bills/${billId}/items/${itemId}`);
      const updatedItem = res.data;
      setBill((prev) => ({
        ...prev,
        items: prev.items.map((it) => (it._id === itemId ? updatedItem : it)),
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update item');
    }
  };

  // Delete subitem from bill
  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/bills/${billId}/items/${itemId}`);
      setBill((prev) => ({
        ...prev,
        items: prev.items.filter((it) => it._id !== itemId),
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete item');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading bill details...</div>;
  }

  if (notFound) {
    return (
      <div className="not-found-container">
        <h2>404 - Bill Not Found</h2>
        <p>The bill you requested does not exist or you do not have permission to view it.</p>
        <Link to="/dashboard" className="back-link">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <Link to="/dashboard" className="back-link">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const items = bill?.items || [];
  const purchasedCount = items.filter((it) => it.purchased).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0;

  return (
    <div className="bill-detail-container">
      <div className="detail-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <div className="detail-titles">
          <h2>{bill.title}</h2>
          {bill.description && <p className="subtitle">{bill.description}</p>}
        </div>

        {/* Progress tracker */}
        <div className="progress-section">
          <div className="progress-stats">
            <span className="progress-text">
              <strong>{purchasedCount}</strong> of <strong>{totalCount}</strong> items purchased
            </span>
            <span className="progress-percentage">{progressPercent}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add Item form */}
      <div className="detail-section">
        <h3>Add Item</h3>
        <AddItemForm onAddItem={handleAddItem} />
      </div>

      {/* Items list */}
      <div className="detail-section">
        <h3>Shopping List ({totalCount})</h3>
        {items.length === 0 ? (
          <p className="empty">No items added yet. Add an item above to start your list!</p>
        ) : (
          <div className="items-list">
            {items.map((item) => (
              <ItemRow
                key={item._id}
                item={item}
                onToggle={handleToggleItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillDetail;
