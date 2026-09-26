import React from 'react';

/**
 * TaskForm Component
 * Renders the input form for adding new shopping items.
 *
 * @param {Object} props
 * @param {string} props.newTodo - Current text value for the item name
 * @param {number} props.quantity - Current numeric value for the item quantity
 * @param {Function} props.handleInputChange - Event handler for item name changes
 * @param {Function} props.handleQuantityChange - Event handler for item quantity changes
 * @param {Function} props.handleSubmit - Form submission handler
 */
const TaskForm = ({
  newTodo,
  quantity,
  handleInputChange,
  handleQuantityChange,
  handleSubmit,
}) => {
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          id="item-name-input"
          type="text"
          className="item-input"
          placeholder="Add an item…"
          value={newTodo}
          onChange={handleInputChange}
          required
        />
        <input
          id="item-quantity-input"
          type="number"
          className="quantity-input"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          title="Quantity"
        />
        <button id="add-item-button" type="submit" className="submit-btn">
          Add Item
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
