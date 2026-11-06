import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import toast from 'react-hot-toast';
import { dashboardApi } from '../api/services';
import { getErrorMessage } from '../api/client';
import Spinner from '../components/common/Spinner';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/common/StatusBadge';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.stats().then(setStats).catch((e) => toast.error(getErrorMessage(e)));
  }, []);

  if (!stats) return <Spinner />;
  const { totals, byDepartment, hiresPerMonth, recent } = stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <Link to="/employees" className="btn-primary">Manage employees</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total employees" value={totals.total} />
        <StatCard label="Active" value={totals.active} tone="green" />
        <StatCard label="Inactive" value={totals.inactive} tone="slate" />
        <StatCard label="New this month" value={totals.newThisMonth} tone="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-semibold text-slate-800">Active employees by department</h2>
          <div className="h-64">
            {byDepartment.length === 0 ? (
              <p className="text-sm text-slate-500">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 font-semibold text-slate-800">Hires, last 6 months</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hiresPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold text-slate-800">Recently added</h2>
        <ul className="divide-y divide-slate-100">
          {recent.map((e) => (
            <li key={e._id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-slate-900">{e.firstName} {e.lastName}</div>
                <div className="text-xs text-slate-500">{e.employeeId} · {e.department?.name || 'Unassigned'}</div>
              </div>
              <StatusBadge status={e.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
