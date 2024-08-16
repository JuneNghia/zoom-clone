'use client';

import { ReactNode, useEffect, useState } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';
import { useUser } from '@clerk/nextjs';
import Error from 'next/error';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { user } = useUser();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user && user.firstName && user.lastName && user.primaryEmailAddress) {
        localStorage.setItem('fullName', `${user.firstName} ${user.lastName}`);
        localStorage.setItem('email', user.primaryEmailAddress?.emailAddress);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user]);

  if (isError) {
    return <Error statusCode={401} />;
  }
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
