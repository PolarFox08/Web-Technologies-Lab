import React from 'react';
import TaskItem from './TaskItem';

/**
 * TaskList Component
 * Renders either an empty placeholder or the list of shopping items.
 *
 * @param {Object} props
 * @param {Array} props.todos - Array of shopping item objects
 * @param {Function} props.onToggle - Handler passed down to toggle item status
 * @param {Function} props.onDelete - Handler passed down to delete an item
 */
const TaskList = ({ todos, onToggle, onDelete }) => {
  if (!todos || todos.length === 0) {
    return <p className="empty">No items yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {todos.map((item) => (
        <TaskItem
          key={item._id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TaskList;
