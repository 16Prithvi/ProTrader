import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StockProvider } from './context/StockContext';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import News from './pages/News';
import Compare from './pages/Compare';



function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/analytics"
              element={
                <AuthGuard>
                  <Analytics />
                </AuthGuard>
              }
            />
            <Route
              path="/insights"
              element={
                <AuthGuard>
                  <Insights />
                </AuthGuard>
              }
            />
            <Route
              path="/news"
              element={
                <AuthGuard>
                  <News />
                </AuthGuard>
              }
            />
            <Route
              path="/compare"
              element={
                <AuthGuard>
                  <Compare />
                </AuthGuard>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </StockProvider>
    </AuthProvider>
  );
}

export default App;
