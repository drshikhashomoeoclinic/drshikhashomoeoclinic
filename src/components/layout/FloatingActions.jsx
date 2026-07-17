import { ArrowUp, CalendarDays, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';
import { phoneHref, whatsappHref } from '../../lib/contact.js';

export default function FloatingActions() {
  const { site } = useClinic();
  const wa = whatsappHref(site.whatsapp, `Hi, I want to book an appointment at ${site.clinicName || 'the clinic'}.`);
  return (
    <>
      <div className="fixed bottom-5 right-3 z-40 hidden flex-col gap-2.5 lg:flex">
        <a className="grid size-10 place-items-center rounded-full bg-[#25D366] text-white shadow-luxury" href={wa} aria-label="WhatsApp"><MessageCircle size={19} /></a>
        <a className="grid size-10 place-items-center rounded-full bg-clinic-blue text-white shadow-luxury" href={phoneHref(site.phone)} aria-label="Call"><Phone size={18} /></a>
        <Link className="grid size-10 place-items-center rounded-full bg-clinic-emerald text-white shadow-luxury" to="/book-appointment" aria-label="Book Appointment"><CalendarDays size={18} /></Link>
        <button className="grid size-10 place-items-center rounded-full bg-white text-clinic-ink shadow-luxury" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><ArrowUp size={18} /></button>
      </div>

      <div className="fixed inset-x-4 bottom-3 z-40 grid grid-cols-4 gap-2 rounded-full border border-white/70 bg-white/90 p-1.5 shadow-luxury backdrop-blur-2xl lg:hidden">
        <a className="grid min-h-10 place-items-center rounded-full bg-[#25D366] text-white" href={wa} aria-label="WhatsApp"><MessageCircle size={18} /></a>
        <a className="grid min-h-10 place-items-center rounded-full bg-clinic-blue text-white" href={phoneHref(site.phone)} aria-label="Call"><Phone size={18} /></a>
        <Link className="grid min-h-10 place-items-center rounded-full bg-clinic-emerald text-white" to="/book-appointment" aria-label="Book Appointment"><CalendarDays size={18} /></Link>
        <button className="grid min-h-10 place-items-center rounded-full bg-clinic-soft text-clinic-ink" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><ArrowUp size={18} /></button>
      </div>
    </>
  );
}
