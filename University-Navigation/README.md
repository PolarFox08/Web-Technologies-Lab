# 🎓 University Website Menu Navigation System

A React.js-based navigation system for a university website featuring responsive dropdown menus, React Router navigation, props, JSX, and event handling.

## 🎯 Aim
Design and implement a React.js-based menu navigation system for a university website containing menus such as About Us, Academics, Admissions, Research, Campus Life, Placements, and Contact Us. Implement dropdown menus for relevant sections and use React components, props, JSX, event handling, and React Router to provide smooth navigation between pages.

## 🗂️ Navigation Hierarchy

- **About Us** (`/`)
- **Academics** (Dropdown)
  - Undergraduate (`/academics/undergraduate`)
  - Postgraduate (`/academics/postgraduate`)
  - PhD (`/academics/phd`)
- **Admissions** (Dropdown)
  - Eligibility (`/admissions/eligibility`)
  - Application Process (`/admissions/application-process`)
  - Important Dates (`/admissions/important-dates`)
- **Research** (Dropdown)
  - Research Areas (`/research/areas`)
  - Publications (`/research/publications`)
- **Campus Life** (`/campus-life`)
- **Placements** (`/placements`)
- **Contact Us** (`/contact`)

## 🛠️ Tech Stack & Key Concepts
- **React.js (v19)** with Vite
- **React Router DOM (v7)** for client-side routing
- **Props & Reusable Components**: `Dropdown.jsx`, `PageContent.jsx`, `Navbar.jsx`
- **Event Handling**: `onMouseEnter`, `onMouseLeave`, and `onClick` for dropdown interactions
- **CSS3**: Responsive flexbox layout and dropdown animations

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```
