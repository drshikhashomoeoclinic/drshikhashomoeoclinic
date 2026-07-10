import { motion } from 'framer-motion';

export default function SectionHeader({ eyebrow, title, text, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      className={center ? 'mx-auto mb-12 max-w-3xl text-center' : 'mb-12 max-w-3xl'}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-4xl font-extrabold tracking-tight text-clinic-ink md:text-6xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-slate-600">{text}</p>}
    </motion.div>
  );
}
