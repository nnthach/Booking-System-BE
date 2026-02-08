import { UserRole } from 'src/enums/role.enum';
import { UserStatus } from 'src/enums/user.enum';
import { WorkScheduleStatus } from 'src/enums/workSchedule';

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

  services: [
    {
      id: 1,
      name: 'Haircut',
      description: 'Professional haircut service',
      status: true,
      duration: 20,
      price: 100000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Hair DIY',
      description: 'Professional hair DIY service',
      status: true,
      duration: 30,
      price: 150000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  timeSlots: [
    {
      id: 1,
      startTime: '9:00:00',
      endTime: '10:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      startTime: '10:00:00',
      endTime: '11:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      startTime: '11:00:00',
      endTime: '12:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      startTime: '12:00:00',
      endTime: '13:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      startTime: '13:00:00',
      endTime: '14:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      startTime: '14:00:00',
      endTime: '15:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      startTime: '15:00:00',
      endTime: '16:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 8,
      startTime: '17:00:00',
      endTime: '18:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 9,
      startTime: '18:00:00',
      endTime: '19:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 10,
      startTime: '19:00:00',
      endTime: '20:00:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  workSchedule: [
    {
      id: 1,
      dayOfWeek: 1,
      startTime: '10:00:00',
      endTime: '19:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },

    {
      id: 2,
      dayOfWeek: 2,
      startTime: '10:00:00',
      endTime: '19:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },

    {
      id: 3,
      dayOfWeek: 3,
      startTime: '10:00:00',
      endTime: '19:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },
    {
      id: 4,
      dayOfWeek: 4,
      startTime: '10:00:00',
      endTime: '19:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },
    {
      id: 5,
      dayOfWeek: 5,
      startTime: '10:00:00',
      endTime: '19:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },
    {
      id: 6,
      dayOfWeek: 6,
      startTime: '9:00:00',
      endTime: '17:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },
    {
      id: 0,
      dayOfWeek: 0,
      startTime: '9:00:00',
      endTime: '17:00:00',
      createdAt: new Date(),
      status: WorkScheduleStatus.AVAILABLE,
    },
  ],
  
  stores:[
    {
      id: 1,
      address: '123 Main St, Cityville',
      image: 'https://example.com/store1.jpg',
    }
  ]
};
