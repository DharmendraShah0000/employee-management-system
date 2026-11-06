import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { departmentApi } from '../api/services';
import { getErrorMessage } from '../api/client';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FormField from '../components/common/FormField';

export default function Departments() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null); // { _id?, name, description }
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => departmentApi.list().then(setItems).catch((e) => toast.error(getErrorMessage(e)));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Department name is required');
    setSaving(true);
    try {
      const body = { name: form.name, description: form.description };
      if (form._id) await departmentApi.update(form._id, body);
      else await departmentApi.create(body);
      toast.success('Department saved');
      setForm(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await departmentApi.remove(toDelete._id);
      toast.success('Department deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDelete(null);
    }
  };

  if (!items) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
        <button className="btn-primary" onClick={() => setForm({ name: '', description: '' })}>+ Add department</button>
      </div>

      <div className="card divide-y divide-slate-100 p-0 sm:p-0">
        {items.length === 0 && <p className="p-6 text-sm text-slate-500">No departments yet.</p>}
        {items.map((d) => (
          <div key={d._id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="font-medium text-slate-900">{d.name}</div>
              <div className="truncate text-sm text-slate-500">{d.description || '—'}</div>
            </div>
            <div className="flex shrink-0 gap-4 text-sm">
              <button className="text-brand-600" onClick={() => setForm(d)}>Edit</button>
              <button className="text-red-600" onClick={() => setToDelete(d)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={Boolean(form)} title={form?._id ? 'Edit department' : 'Add department'} onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <FormField label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="Description"><textarea rows="2" className="input" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
            <div className="flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete department"
        message={toDelete ? `Delete "${toDelete.name}"? Departments in use by employees cannot be deleted.` : ''}
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
