import { CallLayoutType } from '@/lib/enum';

export const sidebarLinks = [
  {
    imgURL: '/icons/Home.svg',
    route: '/',
    label: 'Trang chủ',
  },
];

export const listAdmin = ['nguyenminhtrungnghia@gmail.com', 'c.arevitonline@gmail.com'];

export const listLayout = [
  {
    label: 'Toàn bộ',
    value: CallLayoutType.grid,
  },
  {
    label: 'Tiêu điểm',
    value: CallLayoutType.speaker,
  },
];
