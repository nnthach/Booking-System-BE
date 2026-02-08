import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailConsumer } from './mail.consumer';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [BookingModule],
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}
