import { UserRole } from 'src/enums/role.enum';
import { UserStatus } from 'src/enums/user.enum';

export const seedData = {
  roles: [
    {
      id: 1,
      name: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: UserRole.STAFF,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  users: [
    {
      id: 1,
      password: '123456',
      email: 'admin@gmail.com',
      fullName: 'Quản trị viên',
      status: UserStatus.VERIFIED,
      roleId: 1,
      avatar:
        'https://tse4.mm.bing.net/th/id/OIP.kUUyYavHaSd1nxXBSsO1gQHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      password: '123456',
      email: 'user1@gmail.com',
      fullName: 'Nguyễn Văn A',
      avatar:
        'https://img.freepik.com/premium-vector/illustrations_995281-35700.jpg',
      status: UserStatus.VERIFIED,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      password: '123456',
      email: 'staff1@gmail.com',
      fullName: 'Lê Văn C',
      status: UserStatus.VERIFIED,
      avatar:
        'https://img.freepik.com/premium-vector/illustrations_995281-35700.jpg',
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      id: 4,
      password: '123456',
      email: 'staff2@gmail.com',
      fullName: 'Trần Văn A',
      status: UserStatus.VERIFIED,
      avatar:
        'https://img.freepik.com/premium-vector/illustrations_995281-35700.jpg',
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  staffs: [
    {
      id: 1,
      userId: 3,
      specialty: 'Undercut',
      rating: 0,
      totalBooking: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      id: 2,
      userId: 4,
      specialty: 'Side-part',
      rating: 0,
      totalBooking: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};
