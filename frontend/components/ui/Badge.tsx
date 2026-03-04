import { cn } from '@/lib/utils';
import type { ProjectStatus, InvoiceStatus } from '@/types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-secondary/10 text-secondary border-secondary/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-primary/10 text-primary-300 border-primary/20',
  neutral: 'bg-navy-700 text-navy-300 border-navy-600',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Project status badge
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config: Record<ProjectStatus, { label: string; variant: BadgeVariant }> = {
    active: { label: 'Active', variant: 'success' },
    completed: { label: 'Completed', variant: 'info' },
    on_hold: { label: 'On Hold', variant: 'warning' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

// Invoice status badge
export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config: Record<InvoiceStatus, { label: string; variant: BadgeVariant }> = {
    paid: { label: 'Paid', variant: 'success' },
    unpaid: { label: 'Unpaid', variant: 'warning' },
    overdue: { label: 'Overdue', variant: 'danger' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
