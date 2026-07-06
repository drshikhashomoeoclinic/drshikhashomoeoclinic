import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-glass transition hover:-translate-y-1 hover:border-teal-100">
      <div className="aspect-[16/10] bg-gradient-to-br from-emerald-50 via-white to-blue-50 bg-cover bg-center" style={post.image ? { backgroundImage: `url(${post.image})` } : undefined} />
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-clinic-emerald">{post.category} · {new Date(post.date).toLocaleDateString('en-IN')}</p>
        <h3 className="mt-3 font-display text-xl font-bold text-clinic-ink">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt || post.description}</p>
        <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clinic-emerald">Read article <ArrowRight size={17} /></Link>
      </div>
    </article>
  );
}
