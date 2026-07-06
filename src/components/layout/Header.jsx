import { CalendarDays, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';

const links = [
  ['About', '/about-doctor'],
  ['Treatments', '/treatments'],
  ['Gallery', '/gallery'],
  ['Reviews', '/reviews'],
  ['Blog', '/blog'],
  ['Contact', '/contact']
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { site } = useClinic();
  return (
    <header className="sticky top-0 z-50 border-b border-teal-100/60 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="container-lux flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-10 place-items-center rounded-2xl bg-clinic-emerald font-display text-lg font-bold text-white shadow-lg shadow-emerald-900/15">S</span>
          <span>
            <strong className="block font-display text-lg leading-none text-clinic-ink">{site.clinicName}</strong>
            <small className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Hindmotor - Uttarpara</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-clinic-emerald' : 'text-slate-700 hover:text-clinic-emerald'}`}>{label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="btn-secondary px-4 py-2.5"><Phone size={17} /> Call</a>
          <Link to="/book-appointment" className="btn-primary px-5 py-2.5"><CalendarDays size={17} /> Book</Link>
        </div>
        <button className="rounded-full border border-slate-200 p-2.5 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white p-4 shadow-lg lg:hidden">
          <div className="container-lux grid gap-3">
            {links.map(([label, href]) => <Link key={href} to={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-semibold hover:bg-emerald-50">{label}</Link>)}
            <Link to="/book-appointment" onClick={() => setOpen(false)} className="btn-primary">Book Appointment</Link>
          </div>
        </div>
      )}
    </header>
  );
}
