'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Set a cookie so Next.js middleware can detect auth
      document.cookie = `flowza_token=${localStorage.getItem('flowza_token')}; path=/; max-age=${7 * 24 * 60 * 60}`;
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid email or password';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-50">Welcome back</h1>
        <p className="text-sm text-navy-400 mt-1">Sign in to your Flowza account</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-navy-300">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-navy-500 hover:text-navy-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-4 p-3 rounded-lg bg-navy-800 border border-navy-700 text-xs text-navy-400">
        <p className="font-medium text-navy-300 mb-1">Demo account</p>
        <p>demo@flowza.app / password123</p>
      </div>

      <p className="mt-6 text-center text-sm text-navy-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">
          Sign up free
        </Link>
      </p>
    </>
  );
}
