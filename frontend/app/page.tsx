import Link from 'next/link';
import {
  Zap,
  Users,
  FolderKanban,
  FileText,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Client Management',
    description: 'Keep all your client info in one place — contacts, notes, and history.',
  },
  {
    icon: FolderKanban,
    title: 'Project Tracking',
    description: 'Track deadlines, budgets, and project status at a glance.',
  },
  {
    icon: FileText,
    title: 'Smart Invoicing',
    description: 'Create invoices, track payments, and get notified when things are overdue.',
  },
  {
    icon: BarChart3,
    title: 'Revenue Dashboard',
    description: "See exactly how much you've earned and what's still outstanding.",
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'JWT auth, bcrypt hashing, and per-user data isolation built in.',
  },
  {
    icon: Zap,
    title: 'Blazing Fast',
    description: 'Built on Next.js App Router and Express for instant load times.',
  },
];

const benefits = [
  'No more scattered spreadsheets',
  'Invoice status at a glance',
  'Never miss a deadline',
  'Know your revenue in real-time',
  'Mobile & desktop ready',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-navy-50">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-navy-800 bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">Flowza</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-navy-400 hover:text-navy-100 transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-300 text-xs font-medium mb-8">
          <Zap size={12} />
          Built for freelancers, by freelancers
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-50 leading-tight mb-6">
          Manage clients & projects
          <br />
          <span className="text-gradient">without the chaos.</span>
        </h1>

        <p className="text-lg text-navy-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Flowza is the minimal workspace freelancers use to track clients, projects, and
          invoices — all in one clean dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary px-8 py-3 text-base">
            Start for free
            <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn-ghost px-8 py-3 text-base">
            Sign in to your account
          </Link>
        </div>

        {/* Benefits list */}
        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-navy-400">
              <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Dashboard preview placeholder ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="relative rounded-2xl overflow-hidden border border-navy-700 shadow-2xl bg-navy-800">
          {/* Fake browser chrome */}
          <div className="h-10 bg-navy-900 border-b border-navy-700 flex items-center px-4 gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-amber-500/60" />
            <div className="h-3 w-3 rounded-full bg-secondary/60" />
            <div className="mx-auto w-48 h-5 rounded-md bg-navy-700 text-xs text-navy-500 flex items-center justify-center">
              app.flowza.io/dashboard
            </div>
          </div>
          {/* Preview stats row */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Clients', value: '12', color: 'bg-primary/10 text-primary-300' },
              { label: 'Active Projects', value: '8', color: 'bg-secondary/10 text-secondary' },
              { label: 'Pending Invoices', value: '3', color: 'bg-amber-500/10 text-amber-400' },
              { label: 'Revenue', value: '$24,800', color: 'bg-primary/10 text-primary-300' },
            ].map((card) => (
              <div key={card.label} className="bg-navy-900 rounded-xl p-4 border border-navy-700">
                <p className={`text-xl font-bold mb-1 ${card.color}`}>{card.value}</p>
                <p className="text-xs text-navy-500">{card.label}</p>
              </div>
            ))}
          </div>
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-900 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-navy-50 mb-3">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-navy-400 max-w-md mx-auto">
            Flowza keeps the feature set tight and purposeful — so you spend less time managing
            tools and more time doing great work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card-hover p-6">
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4">
                <Icon className="h-5 w-5 text-primary-300" />
              </div>
              <h3 className="text-base font-semibold text-navy-100 mb-2">{title}</h3>
              <p className="text-sm text-navy-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-navy-800">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold text-navy-50 mb-4">
            Ready to bring order to your freelance business?
          </h2>
          <p className="text-navy-400 mb-8">
            Join freelancers who use Flowza to stay organized and get paid faster.
          </p>
          <Link href="/register" className="btn-primary px-8 py-3 text-base">
            Create your free account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-navy-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-navy-500">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-primary/20">
              <Zap className="h-3 w-3 text-primary-300" />
            </div>
            <span>Flowza — built with ❤️ for freelancers</span>
          </div>
          <p>© {new Date().getFullYear()} Flowza. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
