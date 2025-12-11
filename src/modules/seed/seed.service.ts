import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, EntityManager } from 'typeorm';
import { seedData } from './seed-data';
import * as bcrypt from 'bcrypt';
import { Staff } from 'src/entities/staff.entity';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  private async seedRoles(manager: EntityManager) {
    await manager.getRepository(Role).save(seedData.roles);
  }

  private async seedUsers(manager: EntityManager) {
    const usersWithHashedPassword = seedData.users.map((user) => {
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      return { ...user, password: hashedPassword };
    });
    await manager.getRepository(User).save(usersWithHashedPassword);
  }

  private async seedStaffs(manager: EntityManager) {
    await manager.getRepository(Staff).save(seedData.staffs);
  }

  async initSeedData() {
    try {
      await this.dataSource.transaction(async (manager) => {
        // Tắt kiểm tra khóa ngoại
        await manager.query('SET FOREIGN_KEY_CHECKS = 0');

        // Xoa bỏ dữ liệu cũ
        await manager.query('TRUNCATE TABLE users');
        await manager.query('TRUNCATE TABLE roles');
        await manager.query('TRUNCATE TABLE staffs');

        // Bật lại kiểm tra khóa ngoại
        await manager.query('SET FOREIGN_KEY_CHECKS = 1');

        // Seed dữ liệu theo đúng thứ tự (sửa lại)
        await this.seedRoles(manager);
        await this.seedUsers(manager);
        await this.seedStaffs(manager);
      });

      return { message: 'Seeding completed successfully' };
    } catch (error) {
      console.error('Error seeding data:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
