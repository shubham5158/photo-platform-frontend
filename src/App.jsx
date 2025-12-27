import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./context/auth-context.jsx";
import GlobalSkeleton from "./components/GlobalSkeleton.jsx";

const LoginPage = lazy(() => import("./pages/admin/login-page.jsx"));
const RegisterPage = lazy(() => import("./pages/admin/RegisterPage.jsx"));
const VerifyOtpPage = lazy(() => import("./pages/admin/VerifyOtpPage.jsx"));

const AdminLayout = lazy(() => import("./components/admin-layout.jsx"));
const AdminRoute = lazy(() => import("./components/admin-route.jsx"));
const AdminHomePage = lazy(() => import("./pages/admin/admin-home-page.jsx"));
const EventsPage = lazy(() => import("./pages/admin/events-page.jsx"));
const PhotosPage = lazy(() => import("./pages/admin/photos-page.jsx"));
const DiscountPage = lazy(() => import("./pages/admin/discount-page.jsx"));
const OrdersPage = lazy(() => import("./pages/admin/orders-page.jsx"));
const ClientLinkPage = lazy(() => import("./pages/admin/client-link-page.jsx"));

const ClientLandingPage = lazy(() =>
  import("./pages/client/client-landing-page.jsx")
);
const ClientGalleryPage = lazy(() =>
  import("./pages/client/client-gallery-page.jsx")
);
const ClientCheckoutPage = lazy(() =>
  import("./pages/client/client-checkout-page.jsx")
);
const ClientDownloadPage = lazy(() =>
  import("./pages/client/client-download-page.jsx")
);

const ClientAccessPage = lazy(() =>
  import("./pages/client/client-access-page.jsx")
);

const App = () => {
  const { loading } = useAuth();

  // 🔥 GLOBAL SKELETON ON REFRESH / AUTH LOAD
  if (loading) {
    return <GlobalSkeleton />;
  }

  return (
    <Suspense fallback={<GlobalSkeleton />}>
      <Routes>
        <Route path="/" element={<ClientLandingPage />} />
        <Route path="/client-access" element={<ClientAccessPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId/photos" element={<PhotosPage />} />
          <Route path="discounts" element={<DiscountPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="client-link/:code" element={<ClientLinkPage />} />
        </Route>

        <Route path="/g/:code" element={<ClientGalleryPage />} />
        <Route path="/g/:code/checkout" element={<ClientCheckoutPage />} />
        <Route path="/download/:token" element={<ClientDownloadPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
