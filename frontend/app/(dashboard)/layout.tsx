'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch notification count
  useEffect(() => {
    if (!user) return;
    api
      .get('/dashboard')
      .then((res) => {
        const count = res.data.data?.notifications?.length ?? 0;
        setNotificationCount(count);
      })
      .catch(() => {});
  }, [user]);

  if (isLoading) return <PageLoader />;
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          notificationCount={notificationCount}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
