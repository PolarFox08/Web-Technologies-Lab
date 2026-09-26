import React from 'react';

const ItemRow = ({ item, onToggle, onDelete }) => {
  return (
    <div className={`item-row ${item.purchased ? 'is-purchased' : ''}`}>
      <label className="item-row-left">
        <input
          type="checkbox"
          checked={item.purchased}
          onChange={() => onToggle(item._id)}
          className="item-checkbox"
        />
        <span className={item.purchased ? 'purchased item-text' : 'item-text'}>
          {item.name}
          <span className="item-qty-tag">×{item.quantity}</span>
        </span>
      </label>
      <button
        onClick={() => onDelete(item._id)}
        className="delete-btn"
        title="Remove item"
      >
        Delete
      </button>
    </div>
  );
};

export default ItemRow;
