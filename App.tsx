
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import LandingPage from './pages/LandingPage';
import BlogManagementPage from './pages/BlogManagementPage';
import { useStore } from './store/useStore';

// Placeholder Pages for Demonstration
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl">
    <h2 className="text-xl font-bold text-gray-400">{title} Module</h2>
    <p className="text-gray-400">Coming soon in next iteration...</p>
  </div>
);

const App: React.FC = () => {
  const { user } = useStore();

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/jobs" element={user ? <JobsPage /> : <Navigate to="/login" />} />
          <Route path="/blog-manager" element={user?.role === 'ADMIN' ? <BlogManagementPage /> : <Navigate to="/dashboard" />} />
          
          <Route path="/customers" element={user ? <PlaceholderPage title="Customers" /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={user ? <PlaceholderPage title="Inventory" /> : <Navigate to="/login" />} />
          <Route path="/invoices" element={user ? <PlaceholderPage title="Invoices" /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <PlaceholderPage title="Reports" /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <PlaceholderPage title="Settings" /> : <Navigate to="/login" />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
