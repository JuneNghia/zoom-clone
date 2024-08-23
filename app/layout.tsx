import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import './globals.css';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { viVN } from '@/public/locales/vi-VN';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Video calling App',
  icons: {
    icon: '/images/ca-studio.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ClerkProvider
      localization={viVN}
      afterSignUpUrl={'/'}
      appearance={{
        layout: {
          socialButtonsVariant: 'blockButton',
          logoImageUrl: '/images/ca-studio.png',
        },
        variables: {
          colorText: '#fff',
          colorPrimary: '#0E78F9',
          colorBackground: '#1C1F2E',
          colorInputBackground: '#252A41',
          colorInputText: '#fff',
        },
        elements: {
          footer: 'hidden',
        },
      }}
    >
      <html lang='en'>
        <body className={`${inter.className} bg-dark-2`}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
            transition={Bounce}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
