export default function StatCard({ label, value, tone = 'brand' }) {
  const tones = {
    brand: 'text-brand-700 bg-brand-50',
    green: 'text-emerald-700 bg-emerald-50',
    slate: 'text-slate-700 bg-slate-100',
    amber: 'text-amber-700 bg-amber-50',
  };
  return (
    <div className="card">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-2 inline-block rounded-lg px-3 py-1 text-2xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
