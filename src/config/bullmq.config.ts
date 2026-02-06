import { BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const bullmqConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): BullRootModuleOptions => ({
    connection: {
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
  }),
};
