import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user, loading, register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
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

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setSubmitting(true);
    try {
      // confirmPassword backend ko nahi bhejte
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading={"Join Our\nCommunity"}
      subheading="Together for a Cleaner & Greener City."
    >
      <h1 className="text-3xl font-bold text-navy-900">Create Account</h1>
      <p className="mt-1 text-slate-500">Be a part of a smarter city!</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FormInput
          icon={User}
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          icon={Phone}
          type="tel"
          name="phone"
          placeholder="Phone Number (optional)"
          value={form.phone}
          onChange={handleChange}
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
        <FormInput
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Register"}
          {!submitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-500 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}