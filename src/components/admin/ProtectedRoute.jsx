import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PageLoader from '../ui/PageLoader.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading, firebaseEnabled } = useAuth();
  if (loading) return <PageLoader />;
  if (!firebaseEnabled) return <Navigate to="/admin/login?setup=firebase" replace />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
