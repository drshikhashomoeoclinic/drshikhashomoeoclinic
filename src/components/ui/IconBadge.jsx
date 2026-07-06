import * as Icons from 'lucide-react';

export default function IconBadge({ name = 'Leaf', className = '' }) {
  const Icon = Icons[name] || Icons.Leaf;
  return (
    <span className={`grid size-12 place-items-center rounded-2xl bg-emerald-50 text-clinic-emerald ${className}`}>
      <Icon size={24} />
    </span>
  );
}
