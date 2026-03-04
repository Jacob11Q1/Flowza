'use client';

import { Menu, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clients',
  '/projects': 'Projects',
  '/invoices': 'Invoices',
};

interface NavbarProps {
  onMenuClick: () => void;
  notificationCount?: number;
}

export function Navbar({ onMenuClick, notificationCount = 0 }: NavbarProps) {
  const pathname = usePathname();

  // Get current page title
  const title =
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'Flowza';

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 bg-navy-900/80 backdrop-blur-md border-b border-navy-800">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-navy-100">{title}</h1>
      </div>

      {/* Right: notifications */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
