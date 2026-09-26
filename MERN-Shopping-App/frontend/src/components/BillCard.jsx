import React from 'react';
import { Link } from 'react-router-dom';

const BillCard = ({ bill, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${bill.title}"?`)) {
      onDelete(bill._id);
    }
  };

  const count = bill.itemCount !== undefined ? bill.itemCount : (bill.items ? bill.items.length : 0);

  return (
    <div className="bill-card">
      <Link to={`/bills/${bill._id}`} className="bill-card-content">
        <div className="bill-card-header">
          <h3 className="bill-card-title">{bill.title}</h3>
          <span className="bill-badge">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        </div>
        {bill.description && <p className="bill-card-desc">{bill.description}</p>}
        <div className="bill-card-footer">
          <span className="bill-date">
            Created {new Date(bill.createdAt).toLocaleDateString()}
          </span>
          <span className="bill-view-link">View Details →</span>
        </div>
      </Link>
      <div className="bill-card-actions">
        <button
          onClick={handleDeleteClick}
          className="bill-delete-btn"
          title="Delete bill"
          aria-label="Delete bill"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default BillCard;
