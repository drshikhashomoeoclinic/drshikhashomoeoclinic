import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import PageLoader from './components/ui/PageLoader.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const AboutDoctor = lazy(() => import('./pages/AboutDoctor.jsx'));
const Treatments = lazy(() => import('./pages/Treatments.jsx'));
const TreatmentDetail = lazy(() => import('./pages/TreatmentDetail.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Reviews = lazy(() => import('./pages/Reviews.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogDetail = lazy(() => import('./pages/BlogDetail.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Appointment = lazy(() => import('./pages/Appointment.jsx'));
const Privacy = lazy(() => import('./pages/legal/Privacy.jsx'));
const Terms = lazy(() => import('./pages/legal/Terms.jsx'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminCrud = lazy(() => import('./pages/admin/AdminCrud.jsx'));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments.jsx'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about-doctor" element={<AboutDoctor />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="treatments/:slug" element={<TreatmentDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book-appointment" element={<Appointment />} />
          <Route path="privacy-policy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="homepage" element={<AdminSettings collectionName="pages" documentId="home" title="Homepage Editor" />} />
          <Route path="doctor" element={<AdminSettings collectionName="settings" documentId="doctor" title="Doctor Profile Editor" />} />
          <Route path="services" element={<AdminCrud collectionName="services" title="Services CRUD" />} />
          <Route path="blog" element={<AdminCrud collectionName="posts" title="Blog CRUD" richText />} />
          <Route path="gallery" element={<AdminCrud collectionName="gallery" title="Gallery Image URLs" />} />
          <Route path="reviews" element={<AdminCrud collectionName="reviews" title="Review Management" />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="seo" element={<AdminSeo />} />
          <Route path="settings" element={<AdminSettings collectionName="settings" documentId="site" title="Website Settings" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
