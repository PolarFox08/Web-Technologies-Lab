import { Link, NavLink } from 'react-router-dom';
import Dropdown from './Dropdown';

function Navbar() {
  // Dropdown items configuration
  const academicsItems = [
    { label: 'Undergraduate', path: '/academics/undergraduate' },
    { label: 'Postgraduate', path: '/academics/postgraduate' },
    { label: 'PhD Programs', path: '/academics/phd' }
  ];

  const admissionsItems = [
    { label: 'Eligibility', path: '/admissions/eligibility' },
    { label: 'Application Process', path: '/admissions/application-process' },
    { label: 'Important Dates', path: '/admissions/important-dates' }
  ];

  const researchItems = [
    { label: 'Research Areas', path: '/research/areas' },
    { label: 'Publications', path: '/research/publications' }
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <span className="brand-logo">🎓</span>
        <div className="brand-text">
          <h1>Christopher Olan University</h1>
          <p>Excellence in Education & Research</p>
        </div>
      </div>

      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              About Us
            </NavLink>
          </li>

          {/* Academics Dropdown */}
          <Dropdown title="Academics" items={academicsItems} />

          {/* Admissions Dropdown */}
          <Dropdown title="Admissions" items={admissionsItems} />

          {/* Research Dropdown */}
          <Dropdown title="Research" items={researchItems} />

          <li className="nav-item">
            <NavLink
              to="/campus-life"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Campus Life
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/placements"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Placements
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Contact Us
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
