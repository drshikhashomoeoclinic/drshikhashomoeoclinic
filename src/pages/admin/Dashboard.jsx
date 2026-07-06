import { CalendarDays, FileText, Image, MessageSquare, Stethoscope } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext.jsx';

export default function Dashboard() {
  const { services, posts, reviews, gallery } = useClinic();
  const cards = [
    ['Services', services.length, Stethoscope],
    ['Blog Posts', posts.length, FileText],
    ['Gallery Items', gallery.length, Image],
    ['Reviews', reviews.length, MessageSquare],
    ['Appointments', 'Live', CalendarDays]
  ];
  return (
    <section>
      <h1 className="font-display text-4xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Future-ready control center for content, patients, SEO, uploads, and appointments.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, Icon]) => <div className="rounded-[2rem] bg-white p-6 shadow-glass" key={label}><Icon className="text-clinic-emerald" /><strong className="mt-5 block text-3xl">{value}</strong><span className="text-sm text-slate-500">{label}</span></div>)}
      </div>
      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-glass">
        <h2 className="font-display text-2xl font-bold">Future modules</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['AI Receptionist', 'Patient Portal', 'Medicine Reminder', 'Prescription Upload', 'Video Consultation', 'Payment Gateway', 'Analytics'].map((item) => <span className="rounded-2xl bg-clinic-soft p-4 font-semibold" key={item}>{item}</span>)}
        </div>
      </div>
    </section>
  );
}
