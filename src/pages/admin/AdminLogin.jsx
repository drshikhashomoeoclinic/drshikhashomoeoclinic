import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../../components/seo/SEO.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login, firebaseEnabled } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch {
      setError('Login failed. Check Firebase Auth credentials.');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-clinic-soft p-4">
      <SEO title="Admin Login" />
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-luxury">
        <h1 className="font-display text-4xl font-bold">Admin Login</h1>
        {!firebaseEnabled || params.get('setup') ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">Add Firebase environment variables before admin login.</p> : null}
        <label className="mt-6 block font-semibold">Email<input className="admin-input mt-2" type="email" name="email" required /></label>
        <label className="mt-4 block font-semibold">Password<input className="admin-input mt-2" type="password" name="password" required /></label>
        <button className="btn-primary mt-6 w-full" type="submit">Sign In</button>
        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </main>
  );
}
