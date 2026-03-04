import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-navy-600 border-t-primary',
        sizes[size],
        className
      )}
    />
  );
}

// Full-page loading screen
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-navy-400 text-sm">Loading Flowza...</p>
      </div>
    </div>
  );
}
