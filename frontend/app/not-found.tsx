import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 px-4 text-center">
      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 mb-6">
        <Zap className="h-8 w-8 text-primary-400" />
      </div>
      <h1 className="text-6xl font-extrabold text-navy-700 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-navy-200 mb-3">Page not found</h2>
      <p className="text-navy-500 max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
