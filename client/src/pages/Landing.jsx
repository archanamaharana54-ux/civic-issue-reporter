import { Link } from "react-router-dom";
import {
  Landmark,
  ClipboardCheck,
  MapPin,
  ArrowRight,
  Camera,
  GitMerge,
  Timer,
  Bell,
} from "lucide-react";
import Logo from "../components/Logo";
import CityIllustration from "../components/CityIllustration";
import PhoneMockup from "../components/PhoneMockup";
import { useAuth } from "../context/AuthContext";

// Demo numbers (design jaisa). Baad mein public stats API se aayenge.
const STATS = [
  { icon: Landmark, value: "5K+", label: "Reports", tone: "bg-blue-50 text-brand-500" },
  { icon: ClipboardCheck, value: "98%", label: "Resolved", tone: "bg-teal-50 text-accent-500" },
  { icon: MapPin, value: "50+", label: "Wards", tone: "bg-orange-50 text-warning-500" },
];

const FEATURES = [
  {
    icon: Camera,
    title: "Report with one photo",
    text: "Take a photo and your location is added to the report.",
  },
  {
    icon: GitMerge,
    title: "No duplicate spam",
    text: "Reports within 50 metres are merged into one issue with a report count.",
  },
  {
    icon: Timer,
    title: "Priority and SLA",
    text: "Urgent issues rise automatically when a deadline is missed.",
  },
  {
    icon: Bell,
    title: "Live status",
    text: "Follow every step from reported to resolved.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const dashboardPath = user?.role === "staff" ? "/staff" : "/dashboard";

  return (
    <div id="top" className="bg-page">
      {/* HERO */}
      <div
        className="relative overflow-hidden pb-28"
        style={{
          background:
            "linear-gradient(180deg, #0b2a5b 0%, #14468f 55%, #2a78d0 100%)",
        }}
      >
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-white/90 md:flex">
            <a href="#top" className="hover:text-white">Home</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <Link
            to={user ? dashboardPath : "/login"}
            className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-navy-900 hover:bg-blue-50"
          >
            {user ? "Dashboard" : "Login"}
          </Link>
        </header>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-8 lg:grid-cols-2">
          <div className="text-white">
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              Report. Track.
              <br />
              <span className="text-teal-300">Resolve.</span>
            </h1>
            <p className="mt-4 text-xl font-medium">
              A Smarter City, A Cleaner Tomorrow
            </p>
            <p className="mt-4 max-w-md text-blue-100">
              Report civic issues like potholes, broken streetlights and
              garbage with a single photo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={user ? dashboardPath : "/login"}
                className="flex items-center gap-2 rounded-lg bg-warning-500 px-6 py-3 font-semibold text-white hover:opacity-90"
              >
                Report an Issue <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#about"
                className="rounded-lg border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Know More
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-md">
            <p className="absolute right-0 top-0 z-10 -rotate-6 font-serif text-2xl italic text-white/90">
              Together
              <br />
              for a Better City
            </p>
            <div className="absolute inset-x-0 bottom-0">
              <CityIllustration variant="leaf" />
            </div>
            <PhoneMockup className="absolute bottom-6 left-1/2 w-44 -translate-x-1/2 sm:w-52" />
          </div>
        </section>
      </div>

      {/* STATS CARD (hero ke upar thoda overlap) */}
      <div className="relative z-10 mx-auto -mt-14 max-w-3xl px-6">
        <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-white p-5 shadow-card">
          {STATS.map(({ icon: Icon, value, label, tone }) => (
            <div key={label} className="flex items-center justify-center gap-3 px-2">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-navy-900">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-navy-900">Why Civic Issue Reporter?</h2>
        <p className="mt-4 text-slate-600">
          Civic complaints often get lost with no follow-up. This app gives
          citizens visibility into what happens to their report, and gives
          authorities a prioritized, ward-wise view of what to fix first.
        </p>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold text-navy-900">Features</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-card bg-white p-6 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand-500">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-navy-900 py-8 text-center text-sm text-blue-100">
        <Logo />
        <p className="mt-4">Civic Issue Reporter, a full-stack project. Report. Track. Resolve.</p>
      </footer>
    </div>
  );
}