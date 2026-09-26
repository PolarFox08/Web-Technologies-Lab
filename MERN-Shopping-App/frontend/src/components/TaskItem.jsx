import React from 'react';

/**
 * TaskItem Component
 * Renders an individual shopping list item with toggle and delete capabilities.
 *
 * @param {Object} props
 * @param {Object} props.item - The shopping item document from MongoDB
 * @param {Function} props.onToggle - Handler to toggle the purchased state
 * @param {Function} props.onDelete - Handler to delete the item
 */
const TaskItem = ({ item, onToggle, onDelete }) => {
  return (
    <li className={`task-item ${item.purchased ? 'is-completed' : ''}`}>
      <label className="item-label">
        <input
          type="checkbox"
          className="item-checkbox"
          checked={item.purchased}
          onChange={() => onToggle(item._id)}
          aria-label={`Mark ${item.name} as purchased`}
        />
        <span className={item.purchased ? 'purchased' : ''}>
          {item.name} (x{item.quantity})
        </span>
      </label>
      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(item._id)}
        aria-label={`Delete ${item.name}`}
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
