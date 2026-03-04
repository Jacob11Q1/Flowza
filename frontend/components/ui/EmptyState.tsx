import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="p-4 rounded-2xl bg-navy-800 border border-navy-700 mb-4">
        <Icon className="h-8 w-8 text-navy-500" />
      </div>
      <h3 className="text-base font-semibold text-navy-200 mb-1">{title}</h3>
      <p className="text-sm text-navy-500 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}
