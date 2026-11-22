import { Sprout } from "lucide-react";
import Logo from "./Logo";
import CityIllustration from "./CityIllustration";

export default function AuthLayout({
  heading,
  subheading,
  illustration = "city",
  children,
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 sm:p-8"
      style={{
        background:
          "linear-gradient(135deg, #dbeafe 0%, #eaf2fc 50%, #bfdbfe 100%)",
      }}
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-card lg:grid-cols-2">
        {/* Left panel */}
        <div
          className="relative hidden flex-col p-10 text-white lg:flex"
          style={{
            background:
              "linear-gradient(180deg, #0f3573 0%, #0b2a5b 55%, #0a2347 100%)",
          }}
        >
          <Logo />

          <div className="mt-12 flex-1">
            <h2 className="text-3xl font-bold leading-snug">{heading}</h2>
            <p className="mt-3 max-w-xs text-blue-100">{subheading}</p>
          </div>

          {illustration === "leaf" && (
            <div className="mb-2 flex justify-center">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(34,163,90,0.35), transparent 70%)",
                }}
              >
                <Sprout className="h-20 w-20 text-emerald-400" strokeWidth={1.5} />
              </div>
            </div>
          )}

          <div className="-mx-10 -mb-10">
            <CityIllustration variant={illustration} />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo dark />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}