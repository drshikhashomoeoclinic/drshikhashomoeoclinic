import { ArrowUp, CalendarDays, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';

export default function FloatingActions() {
  const { site } = useClinic();
  const wa = `https://wa.me/${site.whatsapp}?text=Hi%2C%20I%20want%20to%20book%20an%20appointment`;
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a className="grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-luxury" href={wa} aria-label="WhatsApp"><MessageCircle /></a>
      <a className="grid size-12 place-items-center rounded-full bg-clinic-blue text-white shadow-luxury" href={`tel:${site.phone.replace(/\s/g, '')}`} aria-label="Call"><Phone /></a>
      <Link className="grid size-12 place-items-center rounded-full bg-clinic-emerald text-white shadow-luxury" to="/book-appointment" aria-label="Book Appointment"><CalendarDays /></Link>
      <button className="grid size-12 place-items-center rounded-full bg-white text-clinic-ink shadow-luxury" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><ArrowUp /></button>
    </div>
  );
}
