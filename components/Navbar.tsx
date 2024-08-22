'use client'

import Image from 'next/image';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';
import { useCallback } from 'react';

const Navbar = () => {
  const handleClickLogo = useCallback(() => {
    location.reload()
  }, [])
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <div className="flex cursor-pointer items-center gap-1" onClick={handleClickLogo}>
        <Image
          src="/images/ca-studio.png"
          width={100}
          height={100}
          alt="ca-studio logo"
        />

        <p className="ml-2 text-[26px] font-extrabold text-white max-sm:hidden">
          C.Astudio-On 1
        </p>
      </div>
      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
