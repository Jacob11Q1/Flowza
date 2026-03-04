import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="p-1.5 rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-navy-50 tracking-tight">Flowza</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm card p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
