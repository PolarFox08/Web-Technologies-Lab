import { useState } from 'react';
import { Link } from 'react-router-dom';

function Dropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);

  // Event handlers
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <li
      className="nav-item dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="nav-link dropdown-toggle" onClick={handleClick}>
        {title} <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index} className="dropdown-item">
              <Link to={item.path} onClick={handleItemClick}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default Dropdown;
