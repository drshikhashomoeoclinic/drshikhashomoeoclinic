import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO.jsx';

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <SEO title="404" description="Page not found." />
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-6xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you opened is unavailable or has moved.</p>
        <Link className="btn-primary mt-8" to="/">Go Home</Link>
      </div>
    </main>
  );
}
