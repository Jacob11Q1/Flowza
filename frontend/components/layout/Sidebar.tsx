'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  LogOut,
  Zap,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/invoices', label: 'Invoices', icon: FileText },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Clear cookie too
    document.cookie = 'flowza_token=; path=/; max-age=0';
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col',
          'bg-navy-950 border-r border-navy-800',
          'transition-transform duration-300 ease-in-out',
          // Desktop: always visible
          'lg:translate-x-0 lg:static lg:z-auto',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-navy-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-navy-50 tracking-tight">Flowza</span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-primary/10 text-primary-300 border border-primary/20'
                    : 'text-navy-400 hover:bg-navy-800 hover:text-navy-200'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-primary-400' : '')} />
                {label}
                {active && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile + logout */}
        <div className="p-3 border-t border-navy-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-800">
            {/* Avatar */}
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user ? getInitials(user.name) : '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-100 truncate">{user?.name}</p>
              <p className="text-xs text-navy-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded text-navy-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
