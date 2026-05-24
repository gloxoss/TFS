'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@/types/auth';

interface AuthListenerProps {
  initialUser: User | null;
}

export default function AuthListener({ initialUser }: AuthListenerProps) {
  useEffect(() => {
    // Sync the server-side user with the client store
    useAuthStore.getState().setUser(initialUser);
  }, [initialUser]);

  // This component doesn't render anything visible
  return null;
}