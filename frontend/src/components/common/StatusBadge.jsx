export default function StatusBadge({ status }) {
  const active = status === 'active';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
      {status}
    </span>
  );
}
