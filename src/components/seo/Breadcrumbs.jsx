import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="container-lux mt-8 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-clinic-emerald"><Home size={15} /> Home</Link>
      {items.map((item) => (
        <span className="inline-flex items-center gap-2" key={item.label}>
          <ChevronRight size={14} />
          {item.href ? <Link className="hover:text-clinic-emerald" to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
