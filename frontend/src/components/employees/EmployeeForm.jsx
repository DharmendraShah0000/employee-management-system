import { useState } from 'react';
import FormField from '../common/FormField';

const empty = {
  firstName: '', lastName: '', email: '', phone: '', address: '',
  department: '', designation: '', salary: '', joiningDate: '', status: 'active', password: '',
};

const toInput = (e) =>
  e
    ? {
        ...empty,
        ...e,
        department: e.department?._id || '',
        salary: e.salary ?? '',
        joiningDate: e.joiningDate ? e.joiningDate.slice(0, 10) : '',
        password: '',
      }
    : empty;

export default function EmployeeForm({ initial, departments, onSubmit, onCancel, saving, serverErrors = {} }) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState(toInput(initial));
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!values.firstName.trim()) errs.firstName = 'First name is required';
    if (!values.lastName.trim()) errs.lastName = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = 'Valid email is required';
    if (!isEdit && values.password && values.password.length < 8) errs.password = 'Minimum 8 characters';
    if (values.salary !== '' && Number(values.salary) < 0) errs.salary = 'Salary cannot be negative';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = { ...values };
    if (payload.salary === '') delete payload.salary;
    if (!payload.joiningDate) delete payload.joiningDate;
    if (!payload.password) delete payload.password;
    if (isEdit) delete payload.password;
    onSubmit(payload);
  };

  const err = (k) => errors[k] || serverErrors[k];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" error={err('firstName')}><input className="input" value={values.firstName} onChange={set('firstName')} /></FormField>
        <FormField label="Last name" error={err('lastName')}><input className="input" value={values.lastName} onChange={set('lastName')} /></FormField>
        <FormField label="Email" error={err('email')}><input type="email" className="input" value={values.email} onChange={set('email')} /></FormField>
        <FormField label="Phone" error={err('phone')}><input className="input" value={values.phone} onChange={set('phone')} /></FormField>
        <FormField label="Department" error={err('department')}>
          <select className="input" value={values.department} onChange={set('department')}>
            <option value="">— None —</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </FormField>
        <FormField label="Designation" error={err('designation')}><input className="input" value={values.designation} onChange={set('designation')} /></FormField>
        <FormField label="Salary" error={err('salary')}><input type="number" min="0" className="input" value={values.salary} onChange={set('salary')} /></FormField>
        <FormField label="Joining date" error={err('joiningDate')}><input type="date" className="input" value={values.joiningDate} onChange={set('joiningDate')} /></FormField>
        {isEdit && (
          <FormField label="Status" error={err('status')}>
            <select className="input" value={values.status} onChange={set('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormField>
        )}
        {!isEdit && (
          <FormField label="Login password (optional)" error={err('password')} hint="Leave empty to create a record without a login account">
            <input type="password" className="input" value={values.password} onChange={set('password')} autoComplete="new-password" />
          </FormField>
        )}
      </div>
      <FormField label="Address" error={err('address')}><textarea rows="2" className="input" value={values.address} onChange={set('address')} /></FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create employee'}</button>
      </div>
    </form>
  );
}
