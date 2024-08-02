'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { listAdmin, sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useCallback } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const filterListSidebar = useCallback(
    (list: any[]) => {
      const isAdmin = listAdmin.findIndex(
        (email) => user?.primaryEmailAddress?.emailAddress === email,
      );

      return list.filter((menu: any) =>
        isAdmin === -1 ? !menu.onlyAdmin : menu,
      );
    },
    [user?.primaryEmailAddress?.emailAddress],
  );

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between  bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {filterListSidebar(sidebarLinks).map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-lg justify-start',
                {
                  'bg-blue-1': isActive,
                },
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
