import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow, isPast } from 'date-fns';

// Merge Tailwind class names safely
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date to readable string
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

// Relative time (e.g. "3 days ago")
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Check if date is in the past
export function isOverdue(date: string | Date): boolean {
  return isPast(new Date(date));
}

// Get initials from a name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Truncate long strings
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}
