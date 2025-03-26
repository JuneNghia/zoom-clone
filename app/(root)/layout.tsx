'use client';

import { ReactNode, useEffect, useState } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';
import { useUser } from '@clerk/nextjs';
import Error from 'next/error';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { user } = useUser();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user && user.primaryEmailAddress) {
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(' ');
        localStorage.setItem(
          'dataUser',
          `${fullName.trim()} - ${user.primaryEmailAddress.emailAddress}`,
        );
        localStorage.setItem('hostname', window.location.hostname);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
