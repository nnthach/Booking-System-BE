import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailConsumer } from './mail.consumer';

@Module({
  imports: [],
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}
