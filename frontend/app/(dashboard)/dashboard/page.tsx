'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  FolderKanban,
  FileText,
  DollarSign,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProjectStatusBadge, InvoiceStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { formatCurrency, formatDate, timeAgo, getInitials } from '@/lib/utils';
import type { DashboardData, Client, Project } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: DashboardData }>('/dashboard')
      .then((res) => setData(res.data.data!))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentClients, recentProjects, notifications } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Overdue notifications ─────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-400">
              {notifications.length} overdue invoice{notifications.length > 1 ? 's' : ''}
            </h3>
          </div>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-center justify-between text-sm">
                <span className="text-navy-300">{n.message}</span>
                <span className="text-amber-400/70 text-xs ml-4 flex-shrink-0">
                  {formatDate(n.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Stats grid ────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={FolderKanban}
            iconColor="text-secondary"
          />
          <StatsCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={FileText}
            iconColor="text-amber-400"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle={`${formatCurrency(stats.pendingRevenue)} pending`}
            icon={DollarSign}
            iconColor="text-secondary"
          />
        </div>
      </div>

      {/* ── Recent data grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent clients */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-200">Recent Clients</h3>
            <Link href="/clients" className="text-xs text-primary-400 hover:text-primary-300">
              View all →
            </Link>
          </div>
          {recentClients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients yet"
              description="Add your first client to get started"
            />
          ) : (
            <ul className="space-y-3">
              {recentClients.map((client: Client) => (
                <li key={client._id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-300">
                      {getInitials(client.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-100 truncate">{client.name}</p>
                    <p className="text-xs text-navy-500 truncate">{client.email}</p>
                  </div>
                  <span className="text-xs text-navy-600 flex-shrink-0">
                    {timeAgo(client.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent projects */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-200">Recent Projects</h3>
            <Link href="/projects" className="text-xs text-primary-400 hover:text-primary-300">
              View all →
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to get started"
            />
          ) : (
            <ul className="space-y-3">
              {recentProjects.map((project: Project) => (
                <li key={project._id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="h-4 w-4 text-navy-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-100 truncate">{project.name}</p>
                    <p className="text-xs text-navy-500 truncate">
                      {typeof project.client === 'object' ? project.client.name : ''}
                    </p>
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Quick links ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/clients', label: 'Add Client', icon: Users, color: 'text-primary-300' },
          { href: '/projects', label: 'New Project', icon: FolderKanban, color: 'text-secondary' },
          { href: '/invoices', label: 'Create Invoice', icon: FileText, color: 'text-amber-400' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="card-hover p-4 flex items-center gap-3 group"
          >
            <div className="p-2 rounded-lg bg-navy-700 group-hover:bg-navy-600 transition-colors">
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <span className="text-sm font-medium text-navy-300 group-hover:text-navy-100 transition-colors">
              {label}
            </span>
            <Clock className="h-3.5 w-3.5 text-navy-600 ml-auto" />
          </Link>
        ))}
      </div>

      {/* Invoice status display */}
      <div className="text-xs text-navy-600 flex gap-4">
        {(['paid', 'unpaid', 'overdue'] as const).map((s) => (
          <span key={s} className="flex items-center gap-1">
            <InvoiceStatusBadge status={s} />
          </span>
        ))}
      </div>
    </div>
  );
}
