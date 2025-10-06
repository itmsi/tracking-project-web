import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { theme } from './theme';

// Components
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Teams from './pages/Teams';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<Projects />} />
              <Route path="projects/:id/tasks" element={<Tasks />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="teams" element={<Teams />} />
              <Route path="analytics" element={<div>Analytics Page - Coming Soon</div>} />
              <Route path="calendar" element={<div>Calendar Page - Coming Soon</div>} />
              <Route path="notifications" element={<div>Notifications Page - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings Page - Coming Soon</div>} />
              <Route path="profile" element={<div>Profile Page - Coming Soon</div>} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;