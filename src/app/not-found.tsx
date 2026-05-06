import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-widest text-rust-600">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-4 text-steel-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-card bg-navy-900 px-5 py-2.5 text-sm font-medium text-steel-50 hover:bg-navy-700"
      >
        Back to home
      </Link>
    </div>
  );
}
