import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { departmentApi, employeeApi } from '../api/services';
import { getErrorMessage, getFieldErrors } from '../api/client';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import StatusBadge from '../components/common/StatusBadge';
import EmployeeForm from '../components/employees/EmployeeForm';

export default function Employees() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1 });
  const [searchInput, setSearchInput] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const res = await employeeApi.list({ ...params, limit: 10 });
      setItems(res.data);
      setPagination(res.pagination);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { departmentApi.list().then(setDepartments).catch(() => {}); }, []);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.search === searchInput ? f : { ...f, search: searchInput, page: 1 })), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openCreate = () => { setEditing(null); setServerErrors({}); setFormOpen(true); };
  const openEdit = (emp) => { setEditing(emp); setServerErrors({}); setFormOpen(true); };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setServerErrors({});
    try {
      if (editing) await employeeApi.update(editing._id, payload);
      else await employeeApi.create(payload);
      toast.success(editing ? 'Employee updated' : 'Employee created');
      setFormOpen(false);
      load();
    } catch (e) {
      setServerErrors(getFieldErrors(e));
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await employeeApi.remove(toDelete._id);
      toast.success('Employee deactivated');
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        <button className="btn-primary" onClick={openCreate}>+ Add employee</button>
      </div>

      <div className="card grid gap-3 sm:grid-cols-3">
        <input className="input" placeholder="Search name, email, ID…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <select className="input" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}>
          <option value="">All departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">No employees found.</div>
      ) : (
        <>
          {/* Table on tablet/desktop */}
          <div className="card hidden overflow-x-auto p-0 sm:p-0 md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((e) => (
                  <tr key={e._id}>
                    <td className="px-4 py-3 font-mono text-xs">{e.employeeId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{e.firstName} {e.lastName}</td>
                    <td className="px-4 py-3">{e.email}</td>
                    <td className="px-4 py-3">{e.department?.name || '—'}</td>
                    <td className="px-4 py-3">{e.designation}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="space-x-2 px-4 py-3 text-right">
                      <button className="text-brand-600 hover:underline" onClick={() => openEdit(e)}>Edit</button>
                      {e.status === 'active' && <button className="text-red-600 hover:underline" onClick={() => setToDelete(e)}>Deactivate</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on mobile */}
          <div className="space-y-3 md:hidden">
            {items.map((e) => (
              <div key={e._id} className="card space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{e.firstName} {e.lastName}</div>
                    <div className="text-xs text-slate-500">{e.employeeId}</div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
                <div className="text-sm text-slate-600">{e.email}</div>
                <div className="text-sm text-slate-600">{e.designation} · {e.department?.name || 'Unassigned'}</div>
                <div className="flex gap-4 pt-1 text-sm">
                  <button className="text-brand-600" onClick={() => openEdit(e)}>Edit</button>
                  {e.status === 'active' && <button className="text-red-600" onClick={() => setToDelete(e)}>Deactivate</button>}
                </div>
              </div>
            ))}
          </div>
          <Pagination pagination={pagination} onPage={(page) => setFilters({ ...filters, page })} />
        </>
      )}

      <Modal open={formOpen} title={editing ? 'Edit employee' : 'Add employee'} onClose={() => setFormOpen(false)}>
        <EmployeeForm
          key={editing?._id || 'new'}
          initial={editing}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          saving={saving}
          serverErrors={serverErrors}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Deactivate employee"
        message={toDelete ? `Deactivate ${toDelete.firstName} ${toDelete.lastName}? Their record is kept, but they will no longer be able to log in.` : ''}
        confirmLabel="Deactivate"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        busy={deleting}
      />
    </div>
  );
}
