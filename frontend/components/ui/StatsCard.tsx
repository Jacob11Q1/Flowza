import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
}: StatsCardProps) {
  return (
    <div className="card p-5 hover:border-navy-600 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'p-2.5 rounded-lg',
            iconColor === 'text-primary' && 'bg-primary/10',
            iconColor === 'text-secondary' && 'bg-secondary/10',
            iconColor === 'text-amber-400' && 'bg-amber-500/10',
            iconColor === 'text-red-400' && 'bg-red-500/10',
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend.positive
                ? 'bg-secondary/10 text-secondary'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-navy-50 mb-0.5">{value}</p>
        <p className="text-sm text-navy-400">{title}</p>
        {subtitle && <p className="text-xs text-navy-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
