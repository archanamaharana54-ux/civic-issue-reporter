import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  ClipboardList,
  MapPin,
  User,
  ListChecks,
  Activity,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const CITIZEN_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report", label: "Report Issue", icon: Camera },
  { to: "/complaints", label: "My Complaints", icon: ClipboardList },
  { to: "/map", label: "Map View", icon: MapPin },
  { to: "/profile", label: "Profile", icon: User },
];

const STAFF_LINKS = [
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/complaints", label: "Manage Complaints", icon: ListChecks },
  { to: "/map", label: "Map View", icon: MapPin },
  { to: "/staff/analytics", label: "Analytics", icon: Activity },
  { to: "/profile", label: "Profile & Settings", icon: User },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "staff" ? STAFF_LINKS : CITIZEN_LINKS;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile par peeche ka dhundhla parda */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col p-5 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, #0f3573 0%, #0b2a5b 60%, #0a2347 100%)",
        }}
      >
        <div className="mb-8 px-1">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to + label}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-500 text-white"
                    : "text-blue-100 hover:bg-white/10"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100 hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );
}