import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Flowza — Client & Project Management for Freelancers',
  description:
    'Flowza helps freelancers manage clients, projects, and invoices in one clean, minimal workspace.',
  keywords: ['freelance', 'client management', 'invoicing', 'project management', 'SaaS'],
  openGraph: {
    title: 'Flowza',
    description: 'The minimal client & project management tool for freelancers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
