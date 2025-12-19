// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/admin/login-page.jsx";
import EventsPage from "./pages/admin/events-page.jsx";
import PhotosPage from "./pages/admin/photos-page.jsx";
import DiscountPage from "./pages/admin/discount-page.jsx";
import OrdersPage from "./pages/admin/orders-page.jsx";
import AdminHomePage from "./pages/admin/admin-home-page.jsx";

import ClientGalleryPage from "./pages/client/client-gallery-page.jsx";
import ClientCheckoutPage from "./pages/client/client-checkout-page.jsx";
import ClientDownloadPage from "./pages/client/client-download-page.jsx";
import ClientLandingPage from "./pages/client/client-landing-page.jsx";

import AdminLayout from "./components/admin-layout.jsx";
import AdminRoute from "./components/admin-route.jsx";
import ClientLinkPage from "./pages/admin/client-link-page.jsx";
import RegisterPage from "./pages/admin/RegisterPage.jsx";
import VerifyOtpPage from "./pages/admin/VerifyOtpPage.jsx";

const App = () => {
  return (
    <Routes>
      {/* Public Client Landing */}
      <Route path="/" element={<ClientLandingPage />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
       <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Admin protected area */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* Dashboard / Portfolio home */}
        <Route index element={<AdminHomePage />} />
        <Route path="home" element={<AdminHomePage />} />

        <Route path="events" element={<EventsPage />} />
        <Route path="events/:eventId/photos" element={<PhotosPage />} />
        <Route path="discounts" element={<DiscountPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="client-link/:code" element={<ClientLinkPage />} />
      </Route>

      {/* Client-facing */}
      <Route path="/g/:code" element={<ClientGalleryPage />} />
      <Route path="/g/:code/checkout" element={<ClientCheckoutPage />} />
      <Route path="/download/:token" element={<ClientDownloadPage />} />

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
