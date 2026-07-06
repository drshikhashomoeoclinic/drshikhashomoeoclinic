import { Link } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';

export default function Footer() {
  const { site } = useClinic();
  return (
    <footer className="border-t border-slate-100 bg-clinic-ink text-white">
      <div className="container-lux grid gap-10 py-14 md:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
        <div>
          <h2 className="font-display text-3xl font-bold">{site.clinicName}</h2>
          <p className="mt-4 max-w-md text-white/70">{site.footerDescription || 'Premium, personal homoeopathic consultation for families in Hindmotor and online across India.'}</p>
        </div>
        <div><h3 className="font-bold">Quick Links</h3><div className="mt-4 grid gap-2 text-white/70"><Link to="/treatments">Treatments</Link><Link to="/book-appointment">Book Appointment</Link><Link to="/contact">Contact</Link></div></div>
        <div><h3 className="font-bold">Opening Hours</h3><p className="mt-4 text-white/70">{site.hours}</p><p className="mt-2 text-white/70">{site.emergencyText || 'Emergency: nearest hospital or emergency care.'}</p></div>
        <div><h3 className="font-bold">Legal</h3><div className="mt-4 grid gap-2 text-white/70"><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms</Link><Link to="/disclaimer">Disclaimer</Link><Link to="/admin/login">Admin Login</Link></div></div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">© {new Date().getFullYear()} {site.clinicName}. Supportive homoeopathic consultation.</div>
    </footer>
  );
}
