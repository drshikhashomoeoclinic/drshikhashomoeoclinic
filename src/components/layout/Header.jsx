import { CalendarDays, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { phoneHref } from '../../lib/contact.js';

const links = [
  ['Doctor', 'about'],
  ['How We Help', 'services'],
  ['Patient Stories', 'reviews'],
  ['Gallery', 'gallery'],
  ['Health Tips', 'blog'],
  ['Contact', 'contact']
];

function getHeaderOffset() {
  const header = document.querySelector('header');
  return (header?.offsetHeight || 76) + 10;
}

function scrollToSection(id, options = {}) {
  const element = document.getElementById(id);
  if (!element) return false;
  const top = element.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top: Math.max(top, 0), behavior: options.behavior || 'smooth' });
  if (options.updateHash !== false) window.history.replaceState(null, '', `#${id}`);
  return true;
}

function scrollToSectionWhenReady(id, options = {}) {
  let attempts = 0;
  const tryScroll = () => {
    if (scrollToSection(id, options)) return;
    attempts += 1;
    if (attempts < 12) window.setTimeout(tryScroll, 80);
  };
  tryScroll();
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { site } = useClinic();
  const { language, setLanguage, t } = useLanguage();
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
    const id = decodeURIComponent(location.hash.replace('#', ''));
    setActive(id);
    window.requestAnimationFrame(() => scrollToSectionWhenReady(id, { updateHash: false }));
  }, [location.hash, location.pathname]);

  function handleSectionClick(event, id) {
    event.preventDefault();
    setOpen(false);
    setActive(id);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    scrollToSectionWhenReady(id);
  }

  return (
    <header className="sticky top-0 z-50 py-2">
      <div className="container-lux flex h-14 items-center justify-between gap-3 rounded-full border border-white/65 bg-white/68 px-3 shadow-glass backdrop-blur-2xl md:gap-4 md:px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/60 bg-gradient-to-br from-clinic-emerald to-clinic-emeraldDark font-display text-base font-bold text-white shadow-lg shadow-emerald-900/20 md:size-10 md:text-lg">S</span>
          <span className="min-w-0">
            <strong className="block truncate font-display text-base font-bold leading-none text-clinic-ink sm:text-xl">{site.clinicName}</strong>
            <small className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">{site.location || 'Hindmotor, Uttarpara'}</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-4 lg:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`/#${id}`}
              onClick={(event) => handleSectionClick(event, id)}
              className={`relative py-2 text-sm font-semibold transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-clinic-gold after:transition ${active === id ? 'text-clinic-emerald after:scale-x-100' : 'text-slate-700 after:scale-x-0 hover:text-clinic-emerald hover:after:scale-x-100'}`}
            >
              {t(label)}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-clinic-emerald/15 bg-white/55 p-1">
            <button className={`rounded-full px-2.5 py-1 text-xs font-bold ${language === 'en' ? 'bg-clinic-emerald text-white' : 'text-clinic-emerald'}`} type="button" onClick={() => setLanguage('en')}>EN</button>
            <button className={`rounded-full px-2.5 py-1 text-xs font-bold ${language === 'bn' ? 'bg-clinic-emerald text-white' : 'text-clinic-emerald'}`} type="button" onClick={() => setLanguage('bn')}>বাংলা</button>
          </div>
          <a href={phoneHref(site.phone)} className="btn-secondary px-3.5 py-2"><Phone size={16} /> {t('Call')}</a>
          <Link to="/book-appointment" className="btn-primary px-4 py-2"><CalendarDays size={16} /> {t('Book')}</Link>
        </div>
        <button className="rounded-full border border-white/70 bg-white/60 p-2 shadow-sm backdrop-blur-xl lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
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
                {t(label)}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-clinic-soft p-1">
              <button className={`rounded-xl px-3 py-2 text-sm font-bold ${language === 'en' ? 'bg-white text-clinic-emerald shadow-sm' : 'text-slate-600'}`} type="button" onClick={() => setLanguage('en')}>English</button>
              <button className={`rounded-xl px-3 py-2 text-sm font-bold ${language === 'bn' ? 'bg-white text-clinic-emerald shadow-sm' : 'text-slate-600'}`} type="button" onClick={() => setLanguage('bn')}>বাংলা</button>
            </div>
            <Link to="/book-appointment" onClick={() => setOpen(false)} className="btn-primary">{t('Book Appointment')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
