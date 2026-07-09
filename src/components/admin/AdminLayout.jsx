import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const renderNavItems = () => modules.map(([label, href]) => (
    <NavLink
      key={href}
      to={href}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-clinic-emerald' : 'text-slate-600 hover:bg-slate-50'}`}
    >
      {label}
    </NavLink>
  ));

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="flex items-center gap-3 font-display text-xl font-bold"><LayoutDashboard className="text-clinic-emerald" /> Clinic Admin</div>
        <nav className="mt-8 grid gap-2">{renderNavItems()}</nav>
        <button className="btn-secondary mt-8 w-full" onClick={logout}><LogOut size={18} /> Logout</button>
      </aside>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white p-4 lg:hidden">
        <div className="flex items-center gap-3 font-display text-lg font-bold"><LayoutDashboard className="text-clinic-emerald" /> Clinic Admin</div>
        <button className="grid size-11 place-items-center rounded-full bg-clinic-soft text-clinic-ink" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle admin menu">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-x-0 top-[73px] z-40 border-b border-slate-200 bg-white p-4 shadow-luxury lg:hidden">
          <nav className="grid gap-2">{renderNavItems()}</nav>
          <button className="btn-secondary mt-4 w-full" onClick={logout}><LogOut size={18} /> Logout</button>
        </div>
      )}
      <main className="p-4 lg:ml-72 lg:p-8"><Outlet /></main>
    </div>
  );
}
