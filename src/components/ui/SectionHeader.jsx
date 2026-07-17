import { motion } from 'framer-motion';

export default function SectionHeader({ eyebrow, title, text, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      className={center ? 'mx-auto mb-8 max-w-3xl text-center md:mb-10' : 'mb-8 max-w-3xl md:mb-10'}
    >
      {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-clinic-ink md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-slate-600 md:text-[17px]">{text}</p>}
    </motion.div>
  );
}
