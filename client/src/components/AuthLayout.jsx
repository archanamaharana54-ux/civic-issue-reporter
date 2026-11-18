import Logo from "./Logo";

export default function AuthLayout({ heading, subheading, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-navy-900 p-12 text-white lg:flex">
        <Logo />
        <div>
          <h2 className="whitespace-pre-line text-4xl font-bold leading-tight">
            {heading}
          </h2>
          <p className="mt-4 max-w-sm text-lg text-blue-100">{subheading}</p>
        </div>
        <p className="text-sm text-blue-200">Report. Track. Resolve.</p>
      </div>

      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo dark />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}