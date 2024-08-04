export const sidebarLinks = [
  {
    imgURL: '/icons/Home.svg',
    route: '/',
    label: 'Trang chủ',
  },

  {
    imgURL: '/icons/upcoming.svg',
    route: '/upcoming',
    label: 'Lịch sắp tới',
    onlyAdmin: true,
  },
  {
    imgURL: '/icons/previous.svg',
    route: '/previous',
    label: 'Lịch sử',
    onlyAdmin: true,
  },
  {
    imgURL: '/icons/add-personal.svg',
    route: '/personal-room',
    label: 'Phòng cá nhân',
    onlyAdmin: true,
  },
];

export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];

export const listAdmin = ['nguyenminhtrungnghia@gmail.com'];
