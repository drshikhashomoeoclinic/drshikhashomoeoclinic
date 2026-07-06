import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import IconBadge from '../ui/IconBadge.jsx';

export default function TreatmentCard({ service }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-glass">
      <IconBadge name={service.icon} />
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-clinic-blue">{service.category}</p>
      <h3 className="mt-3 font-display text-2xl font-bold text-clinic-ink">{service.title}</h3>
      <p className="mt-3 text-slate-600">{service.description}</p>
      <Link to={`/treatments/${service.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-clinic-emerald">
        View treatment <ArrowUpRight size={18} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
