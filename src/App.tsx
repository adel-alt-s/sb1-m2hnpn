import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, CreditCard, Package, UserPlus } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Treatments from './pages/Treatments';
import Billing from './pages/Billing';
import CabinetManagement from './pages/CabinetManagement';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  const menuItems = [
    ...(hasPermission('view_dashboard') ? [{
      icon: LayoutDashboard,
      label: 'Tableau de bord',
      path: '/',
      permissions: ['view_dashboard']
    }] : []),
    { 
      icon: Calendar, 
      label: 'Agenda', // Changed from "Rendez-vous" to "Agenda"
      path: '/appointments', 
      permissions: ['view_appointments']
    },
    { 
      icon: Users, 
      label: 'Patients', 
      path: '/patients', 
      permissions: ['view_patients']
    },
    ...(hasPermission('view_treatments') ? [{
      icon: FileText,
      label: 'Traitements',
      path: '/treatments',
      permissions: ['view_treatments']
    }] : []),
    { 
      icon: CreditCard, 
      label: 'Facturation', 
      path: '/billing', 
      permissions: ['view_billing']
    },
    ...(hasPermission('view_supplies') ? [{
      icon: Package,
      label: 'Gestion Cabinet',
      path: '/cabinet',
      permissions: ['view_supplies']
    }] : []),
    ...(hasPermission('manage_users') ? [{
      icon: UserPlus,
      label: 'Gestion Utilisateurs',
      path: '/admin',
      permissions: ['manage_users']
    }] : [])
  ].filter(item => item.permissions.some(permission => hasPermission(permission)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute requiredPermissions={['view_dashboard']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/appointments" element={
              <ProtectedRoute requiredPermissions={['view_appointments']}>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute requiredPermissions={['view_patients']}>
                <Patients />
              </ProtectedRoute>
            } />
            <Route path="/treatments" element={
              <ProtectedRoute requiredPermissions={['view_treatments']}>
                <Treatments />
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute requiredPermissions={['view_billing']}>
                <Billing />
              </ProtectedRoute>
            } />
            <Route path="/cabinet" element={
              <ProtectedRoute requiredPermissions={['view_supplies']}>
                <CabinetManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredPermissions={['manage_users']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="*" element={
              hasPermission('view_dashboard') ? 
                <Navigate to="/" /> : 
                <Navigate to="/appointments" />
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}