import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import IconBadge from '../ui/IconBadge.jsx';

export default function TreatmentCard({ service }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="group rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-glass transition hover:border-teal-100">
      <IconBadge name={service.icon} />
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-clinic-blue">{service.category}</p>
      <h3 className="mt-3 font-display text-xl font-bold text-clinic-ink">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
      <Link to={`/treatments/${service.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clinic-emerald">
        View treatment <ArrowUpRight size={18} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
