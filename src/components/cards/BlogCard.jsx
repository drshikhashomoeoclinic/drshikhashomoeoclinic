import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <article className="group glass-card glass-card-hover overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-white/90 via-clinic-cream to-emerald-50 bg-cover bg-center transition duration-500 group-hover:scale-[1.015]" style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}>
        {!post.image && (
          <div className="absolute inset-0 grid place-items-center p-5 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-full border border-white/70 bg-white/65 text-clinic-emerald shadow-sm"><FileText size={24} /></span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-clinic-emerald/70">Health Note</p>
            </div>
            <Sparkles className="absolute right-5 top-5 text-clinic-gold/45" size={22} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-clinic-ink/28 via-transparent to-white/10 transition duration-300 group-hover:scale-105" />
        <div className="absolute bottom-3 left-3 rounded-full border border-white/60 bg-white/72 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-clinic-emerald backdrop-blur-xl">{post.category}</div>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-clinic-gold">{new Date(post.date).toLocaleDateString('en-IN')}</p>
        <h3 className="mt-2 font-display text-xl font-bold leading-tight text-clinic-ink">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt || post.description}</p>
        <Link to={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-clinic-emerald">Read More <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
      </div>
    </article>
  );
}
