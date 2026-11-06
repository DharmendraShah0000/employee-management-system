import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, getFieldErrors } from '../api/client';
import FormField from '../components/common/FormField';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      errs.password = 'At least 8 characters, with a letter and a number';
    }
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      toast.success('Account created');
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(getFieldErrors(err));
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4" noValidate>
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" error={errors.firstName}><input className="input" value={form.firstName} onChange={set('firstName')} /></FormField>
          <FormField label="Last name" error={errors.lastName}><input className="input" value={form.lastName} onChange={set('lastName')} /></FormField>
        </div>
        <FormField label="Email" error={errors.email}><input type="email" className="input" value={form.email} onChange={set('email')} autoComplete="email" /></FormField>
        <FormField label="Password" error={errors.password}><input type="password" className="input" value={form.password} onChange={set('password')} autoComplete="new-password" /></FormField>
        <FormField label="Confirm password" error={errors.confirm}><input type="password" className="input" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" /></FormField>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        <p className="text-center text-sm text-slate-600">
          Already registered? <Link to="/login" className="font-medium text-brand-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
