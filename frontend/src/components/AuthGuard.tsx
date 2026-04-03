'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.push('/');
    }
  }, [user, isLoading, requiredRoles, router]);

  if (isLoading) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>;
  }

  if (!user) return null;
  if (requiredRoles && !requiredRoles.includes(user.role)) return null;

  return <>{children}</>;
}
