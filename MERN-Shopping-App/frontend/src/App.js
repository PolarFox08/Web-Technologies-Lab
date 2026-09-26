import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BillDetail from './pages/BillDetail';
import { useAuth } from './context/AuthContext';
import './App.css';

const NotFound = () => (
  <div className="not-found-page">
    <h2>404 - Page Not Found</h2>
    <p>Oops! The page you are looking for does not exist.</p>
    <Link to="/dashboard" className="back-link">
      Go to Dashboard
    </Link>
  </div>
);

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Initializing application...</div>;
  }

  return (
    <div className="app-root">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Root redirect based on auth */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />

          {/* Public auth routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/bills/:billId"
            element={
              <PrivateRoute>
                <BillDetail />
              </PrivateRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
