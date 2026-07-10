import { CalendarDays, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';
import { phoneHref } from '../../lib/contact.js';

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
    <header className="sticky top-0 z-50 border-b border-white/45 bg-white/55 shadow-sm shadow-slate-900/5 backdrop-blur-2xl">
      <div className="container-lux flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-11 place-items-center rounded-2xl border border-white/50 bg-gradient-to-br from-clinic-emerald to-clinic-emeraldDark font-display text-lg font-bold text-white shadow-lg shadow-emerald-900/20">S</span>
          <span>
            <strong className="block font-display text-lg leading-none text-clinic-ink">{site.clinicName}</strong>
            <small className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{site.location || 'Hindmotor, Uttarpara'}</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => `relative py-2 text-sm font-semibold transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-clinic-gold after:transition ${isActive ? 'text-clinic-emerald after:scale-x-100' : 'text-slate-700 hover:text-clinic-emerald hover:after:scale-x-100'}`}>{label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={phoneHref(site.phone)} className="btn-secondary px-4 py-2.5"><Phone size={17} /> Call</a>
          <Link to="/book-appointment" className="btn-primary px-5 py-2.5"><CalendarDays size={17} /> Book</Link>
        </div>
        <button className="rounded-full border border-white/70 bg-white/55 p-2.5 shadow-sm backdrop-blur-xl lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-2xl lg:hidden">
          <div className="container-lux grid gap-3">
            {links.map(([label, href]) => <Link key={href} to={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-semibold hover:bg-emerald-50">{label}</Link>)}
            <Link to="/book-appointment" onClick={() => setOpen(false)} className="btn-primary">Book Appointment</Link>
          </div>
        </div>
      )}
    </header>
  );
}
