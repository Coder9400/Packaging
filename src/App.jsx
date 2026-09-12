import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { MarketplacePage } from './pages/Marketplace/MarketplacePage';
import { MaterialDetailPage } from './pages/Marketplace/MaterialDetailPage';
import { ListingsPage } from './pages/Listings/ListingsPage';
import { ListMaterialPage } from './pages/Listings/ListMaterialPage';
import { RequestsPage } from './pages/Orders/RequestsPage';
import { OrderDetailPage } from './pages/Orders/OrderDetailPage';
import { LogisticsPage } from './pages/Logistics/LogisticsPage';
import { ImpactPage } from './pages/Impact/ImpactPage';
import { MessagesPage } from './pages/Messages/MessagesPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AdminPage } from './pages/Admin/AdminPage';

export function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Standalone Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public Browsing Routes with Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:id" element={<MaterialDetailPage />} />
            </Route>

            {/* Protected Enterprise & Dashboard Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listings/new" element={<Navigate to="/list-material" replace />} />
              <Route path="/list-material" element={<ListMaterialPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/orders" element={<Navigate to="/requests?tab=orders" replace />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MarketplaceProvider>
    </AuthProvider>
  );
}

export default App;
