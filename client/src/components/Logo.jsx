import { Building2 } from "lucide-react";

export default function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
        <Building2 className="h-6 w-6 text-white" />
      </div>
      <div
        className={`font-bold leading-tight ${
          dark ? "text-navy-900" : "text-white"
        }`}
      >
        <div>Civic Issue</div>
        <div>Reporter</div>
      </div>
    </div>
  );
}