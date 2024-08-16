'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SiginInPage() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      localStorage.clear();
    }
  }, [user]);

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
}
