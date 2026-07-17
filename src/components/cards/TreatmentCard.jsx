import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Baby,
  Bone,
  Brain,
  Droplets,
  FlaskConical,
  HeartPulse,
  Leaf,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Wind
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const iconMap = {
  Activity,
  Baby,
  Bone,
  Brain,
  Droplets,
  FlaskConical,
  HeartPulse,
  Leaf,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Wind
};

function ServiceMedia({ service }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = typeof service.image === 'string' ? service.image.trim() : '';
  const Icon = iconMap[service.icon] || Stethoscope;

  if (image && !imageFailed) {
    return (
      <span className="grid size-[72px] place-items-center overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-sm">
        <img
          className="h-[72px] w-[72px] rounded-2xl object-cover"
          src={image}
          alt={service.title || 'Treatment'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className="grid size-[72px] place-items-center rounded-2xl border border-white/70 bg-white/65 text-clinic-emerald shadow-sm">
      <Icon size={32} />
    </span>
  );
}

export default function TreatmentCard({ service }) {
  return (
    <motion.article whileHover={{ y: -9, scale: 1.012 }} className="group glass-card glass-card-hover h-full p-5 sm:p-7">
      <ServiceMedia service={service} />
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-clinic-gold">{service.category}</p>
      <h3 className="mt-3 font-display text-xl font-bold leading-tight text-clinic-ink sm:text-2xl">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
      <Link to={`/treatments/${service.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-clinic-emerald">
        View treatment <ArrowUpRight size={18} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
