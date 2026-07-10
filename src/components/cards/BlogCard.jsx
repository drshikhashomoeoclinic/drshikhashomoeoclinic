import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <article className="group glass-card glass-card-hover overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/85 via-clinic-cream to-emerald-50 bg-cover bg-center transition duration-500 group-hover:scale-[1.015]" style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}>
        {!post.image && <FileText className="absolute left-5 top-5 text-clinic-emerald/45" size={36} />}
        <div className="absolute inset-0 bg-gradient-to-t from-clinic-ink/28 via-transparent to-white/10 transition duration-300 group-hover:scale-105" />
        <div className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/68 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-clinic-emerald backdrop-blur-xl">{post.category}</div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-clinic-gold">{new Date(post.date).toLocaleDateString('en-IN')}</p>
        <h3 className="mt-3 font-display text-xl font-bold leading-tight text-clinic-ink sm:text-2xl">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt || post.description}</p>
        <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clinic-emerald">Read More <ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
      </div>
    </article>
  );
}
