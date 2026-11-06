export default function Spinner({ fullScreen = false }) {
  const spinner = (
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" role="status" aria-label="Loading" />
  );
  if (fullScreen) return <div className="flex min-h-screen items-center justify-center">{spinner}</div>;
  return <div className="flex justify-center py-10">{spinner}</div>;
}
