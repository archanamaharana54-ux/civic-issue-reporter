import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pehle se logged in ho to seedha dashboard
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === "staff" ? "/staff" : "/dashboard"} replace />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      illustration="city"
      heading={
        <>
          Smart City
          <br />
          Starts with <span className="text-teal-300">You</span>
        </>
      }
      subheading="Log in to report and track civic issues."
    >
      <h1 className="text-center text-3xl font-bold text-navy-900">Login</h1>
      <p className="mt-1 text-center text-slate-600">Welcome back!</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FormInput
          icon={Mail}
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormInput
          icon={Lock}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="text-right">
          <a href="#" className="text-sm font-medium text-brand-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 py-3 font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
          {!submitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-sm text-slate-500">
        <div className="h-px flex-1 bg-slate-200" />
        or continue with
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-brand-500 hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}