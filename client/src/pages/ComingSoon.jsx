export default function ComingSoon({ title }) {
  return (
    <div className="rounded-card bg-white p-8 shadow-card">
      <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
      <p className="mt-2 text-slate-600">This page is coming soon.</p>
    </div>
  );
}