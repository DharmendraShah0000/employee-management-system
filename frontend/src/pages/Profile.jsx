import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { employeeApi } from '../api/services';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import FormField from '../components/common/FormField';
import StatusBadge from '../components/common/StatusBadge';

const Row = ({ label, value }) => (
  <div>
    <dt className="text-xs uppercase text-slate-500">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900">{value || '—'}</dd>
  </div>
);

export default function Profile() {
  const { refresh } = useAuth();
  const [emp, setEmp] = useState(null);
  const [form, setForm] = useState({ phone: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    employeeApi.me().then((e) => { setEmp(e); setForm({ phone: e.phone || '', address: e.address || '' }); })
      .catch((e) => toast.error(getErrorMessage(e)));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await employeeApi.update(emp._id, form);
      setEmp(updated);
      await refresh();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!emp) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">{emp.firstName} {emp.lastName}</div>
            <div className="text-sm text-slate-500">{emp.employeeId}</div>
          </div>
          <StatusBadge status={emp.status} />
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Row label="Email" value={emp.email} />
          <Row label="Department" value={emp.department?.name} />
          <Row label="Designation" value={emp.designation} />
          <Row label="Joining date" value={emp.joiningDate && new Date(emp.joiningDate).toLocaleDateString()} />
        </dl>
      </div>

      <form onSubmit={save} className="card space-y-4">
        <h2 className="font-semibold text-slate-800">Contact details</h2>
        <FormField label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
        <FormField label="Address"><textarea rows="2" className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></FormField>
        <div className="flex justify-end"><button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
      </form>
    </div>
  );
}
