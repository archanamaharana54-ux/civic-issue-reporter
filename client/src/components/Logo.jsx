import { Building2 } from "lucide-react";

export default function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(135deg, #14b8c6, #22a35a)" }}
      >
        <Building2 className="h-6 w-6 text-white" />
      </div>
      <div
        className={`text-sm font-bold leading-tight ${
          dark ? "text-navy-900" : "text-white"
        }`}
      >
        <div>Civic Issue</div>
        <div>Reporter</div>
      </div>
    </div>
  );
}