import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-glass">
      <div className="aspect-[16/10] bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-emerald">{post.category} · {new Date(post.date).toLocaleDateString('en-IN')}</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-clinic-ink">{post.title}</h3>
        <p className="mt-3 text-slate-600">{post.excerpt || post.description}</p>
        <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-clinic-emerald">Read article <ArrowRight size={17} /></Link>
      </div>
    </article>
  );
}
