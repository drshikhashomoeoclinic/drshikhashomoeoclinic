import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingActions from './FloatingActions.jsx';
import { installAnalytics } from '../../lib/analytics.js';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    installAnalytics();
  }, [pathname]);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <FloatingActions />
    </>
  );
}
