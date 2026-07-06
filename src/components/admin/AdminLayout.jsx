import { LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const modules = [
  ['Dashboard', '/admin/dashboard'],
  ['Homepage Editor', '/admin/homepage'],
  ['Doctor Profile', '/admin/doctor'],
  ['Services', '/admin/services'],
  ['Blog', '/admin/blog'],
  ['Gallery', '/admin/gallery'],
  ['Reviews', '/admin/reviews'],
  ['Appointments', '/admin/appointments'],
  ['Patients', '/admin/patients'],
  ['SEO Manager', '/admin/seo'],
  ['Settings', '/admin/settings']
];

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="flex items-center gap-3 font-display text-xl font-bold"><LayoutDashboard className="text-clinic-emerald" /> Clinic Admin</div>
        <nav className="mt-8 grid gap-2">{modules.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-clinic-emerald' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</NavLink>)}</nav>
        <button className="btn-secondary mt-8 w-full" onClick={logout}><LogOut size={18} /> Logout</button>
      </aside>
      <main className="p-4 lg:ml-72 lg:p-8"><Outlet /></main>
    </div>
  );
}
