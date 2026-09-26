import React, { useState } from 'react';

const AddItemForm = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Item name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAddItem({ name: name.trim(), quantity: Number(quantity) || 1 });
      setName('');
      setQuantity(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="input-group">
        <input
          type="text"
          className="item-input"
          placeholder="Add an item (e.g., Milk, Apples)..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          className="quantity-input"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default AddItemForm;
