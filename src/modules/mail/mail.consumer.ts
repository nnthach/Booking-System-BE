import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueNameEnum } from 'src/enums/queue-name.enum';
import { MailService } from './mail.service';
import { Job } from 'bullmq';
import { EmailJobNameEnum } from 'src/enums/email-job-name.enum';
import {
  SendEmailBookingSuccessJob,
  SendEmailVerificationJob,
  SendEmailWelcomeStaffJob,
} from 'src/common/interfaces';
import { BookingService } from '../booking/booking.service';

@Processor(QueueNameEnum.EMAIL)
export class EmailConsumer extends WorkerHost {
  constructor(
    private readonly mailService: MailService,
    private readonly bookingService: BookingService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name as EmailJobNameEnum) {
      case EmailJobNameEnum.SEND_EMAIL_VERIFICATION: {
        const { email, token } = job.data as SendEmailVerificationJob;
        await this.mailService.sendEmailVerification(email, token);
        break;
      }

      case EmailJobNameEnum.SEND_EMAIL_WELCOME_STAFF: {
        const { fullName, email, password } =
          job.data as SendEmailWelcomeStaffJob;

        await this.mailService.sendEmailWelcomeStaff(fullName, email, password);
        break;
      }

      case EmailJobNameEnum.SEND_EMAIL_BOOKING_SUCCESS: {
        const data = job.data as SendEmailBookingSuccessJob;

        const booking = await this.bookingService.findOne(data.bookingId);
        if (!booking) return;

        await this.mailService.sendEmailBookingSuccess(booking);
        break;
      }
    }
  }
}
