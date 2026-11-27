import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="rounded-card bg-white p-8 shadow-card">
      <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Logged in as {user.name} ({user.role}). Real dashboard next step.
      </p>
    </div>
  );
}