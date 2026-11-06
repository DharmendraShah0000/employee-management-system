import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-5xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  );
}
