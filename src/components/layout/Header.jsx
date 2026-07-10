import { CalendarDays, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';
import { phoneHref } from '../../lib/contact.js';

const links = [
  ['Doctor', 'about'],
  ['How We Help', 'services'],
  ['Patient Stories', 'reviews'],
  ['Gallery', 'gallery'],
  ['Health Tips', 'blog'],
  ['Contact', 'contact']
];

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return false;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
  return true;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { site } = useClinic();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const ids = links.map(([, id]) => id);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0.12, 0.28, 0.48] });

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;
    const id = location.hash.replace('#', '');
    window.requestAnimationFrame(() => scrollToSection(id));
  }, [location.hash, location.pathname]);

  function handleSectionClick(event, id) {
    event.preventDefault();
    setOpen(false);
    setActive(id);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    if (!scrollToSection(id)) window.history.replaceState(null, '', `#${id}`);
  }

  return (
    <header className="sticky top-0 z-50 py-3">
      <div className="container-lux flex h-16 items-center justify-between gap-3 rounded-full border border-white/65 bg-white/62 px-3 shadow-glass backdrop-blur-2xl md:gap-4 md:px-5">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/60 bg-gradient-to-br from-clinic-emerald to-clinic-emeraldDark font-display text-base font-bold text-white shadow-lg shadow-emerald-900/20 md:size-11 md:text-lg">S</span>
          <span className="min-w-0">
            <strong className="block truncate font-display text-base font-bold leading-none text-clinic-ink sm:text-2xl">{site.clinicName}</strong>
            <small className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{site.location || 'Hindmotor, Uttarpara'}</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`/#${id}`}
              onClick={(event) => handleSectionClick(event, id)}
              className={`relative py-2 text-[15px] font-semibold transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-clinic-gold after:transition ${active === id ? 'text-clinic-emerald after:scale-x-100' : 'text-slate-700 after:scale-x-0 hover:text-clinic-emerald hover:after:scale-x-100'}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={phoneHref(site.phone)} className="btn-secondary px-4 py-2.5"><Phone size={17} /> Call</a>
          <Link to="/book-appointment" className="btn-primary px-5 py-2.5"><CalendarDays size={17} /> Book</Link>
        </div>
        <button className="rounded-full border border-white/70 bg-white/60 p-2.5 shadow-sm backdrop-blur-xl lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="px-4 lg:hidden">
          <div className="container-lux mt-2 grid gap-3 rounded-[1.5rem] border border-white/65 bg-white/82 p-4 shadow-luxury backdrop-blur-2xl">
            {links.map(([label, id]) => (
              <a
                key={id}
                href={`/#${id}`}
                onClick={(event) => handleSectionClick(event, id)}
                className={`rounded-2xl px-4 py-3 font-semibold ${active === id ? 'bg-emerald-50 text-clinic-emerald' : 'hover:bg-emerald-50'}`}
              >
                {label}
              </a>
            ))}
            <Link to="/book-appointment" onClick={() => setOpen(false)} className="btn-primary">Book Appointment</Link>
          </div>
        </div>
      )}
    </header>
  );
}
