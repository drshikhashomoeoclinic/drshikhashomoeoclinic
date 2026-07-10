import { Instagram, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';

export default function Footer() {
  const { site, home } = useClinic();
  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-white/10 bg-[#101915] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-clinic-gold/60 to-transparent" />
      <div className="absolute -right-28 top-10 size-72 rounded-full border border-clinic-gold/10 bg-clinic-gold/10 blur-2xl" />
      <div className="container-lux relative grid gap-8 py-14 md:grid-cols-[1.2fr_.75fr_.9fr_.95fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold">{site.clinicName}</h2>
          <p className="mt-4 max-w-md text-white/68">{home.footerDescription || site.footerDescription || 'Premium, personal homoeopathic consultation for families in Hindmotor and online across India.'}</p>
          <div className="mt-5 flex gap-2">
            <a className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/75 transition hover:border-clinic-gold/50 hover:text-clinic-gold" href={`mailto:${site.email}`} aria-label="Email clinic"><Mail size={18} /></a>
            <a className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/75 transition hover:border-clinic-gold/50 hover:text-clinic-gold" href={site.social?.instagram || '#'} aria-label="Instagram"><Instagram size={18} /></a>
            <a className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/75 transition hover:border-clinic-gold/50 hover:text-clinic-gold" href={site.social?.youtube || '#'} aria-label="YouTube"><Youtube size={18} /></a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/68">
            <Link className="transition hover:text-clinic-gold" to="/treatments">Treatments</Link>
            <Link className="transition hover:text-clinic-gold" to="/book-appointment">Book Appointment</Link>
            <Link className="transition hover:text-clinic-gold" to="/contact">Contact</Link>
            <Link className="transition hover:text-clinic-gold" to="/admin/login">Admin Login</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Clinic Details</h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/68">
            <p className="flex gap-2"><Phone className="mt-1 shrink-0 text-clinic-gold" size={16} /> {site.phone}</p>
            <p className="flex gap-2"><MapPin className="mt-1 shrink-0 text-clinic-gold" size={16} /> {site.address}</p>
            <p>{site.hours}</p>
            <p>{home.emergencyText || site.emergencyText || 'Emergency: nearest hospital or emergency care.'}</p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <h3 className="font-bold text-white">Newsletter</h3>
          <p className="mt-3 text-sm leading-6 text-white/62">Receive clinic updates and helpful health notes.</p>
          <div className="mt-4 flex overflow-hidden rounded-full border border-white/10 bg-white/[0.06] p-1">
            <input className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/40" placeholder="Email address" aria-label="Email address" />
            <button className="grid size-10 place-items-center rounded-full bg-clinic-gold text-clinic-ink transition hover:scale-105" type="button" aria-label="Subscribe"><Send size={17} /></button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/55">&copy; {new Date().getFullYear()} {site.clinicName}. Supportive homoeopathic consultation.</div>
    </footer>
  );
}
