import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { Booking } from 'src/entities/booking.entity';
import { BookingPaymentTypeEnum } from 'src/enums/booking-payment-type.enum';
import { BookingStatus } from 'src/enums/booking.enum';

@Injectable()
export class MailService {
  private fromEmail: string | undefined;

  constructor(private configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (!sendGridApiKey) {
      throw new InternalServerErrorException(
        'Send email function is not ready',
      );
    }
    sgMail.setApiKey(sendGridApiKey);

    this.fromEmail = this.configService.get<string>('MAIL_FROM');
  }

  async sendEmailVerification(email: string, token: string) {
    console.log('start run send email', email);
    try {
      const verificationUrl = `http://localhost:8080/api/auth/verify-email?token=${token}`;

      const templatePath = path.join(
        process.cwd(),
        'src',
        'modules',
        'mail',
        'html',
        'EmailVerification.html',
      );
      let html = await readFile(templatePath, 'utf-8');

      html = html
        .replace(/\$\{name\}/g, 'My Friend')
        .replace(/\$\{link\}/g, verificationUrl)
        .replace(/\$\{button\}/g, 'Verify Email')
        .replace(/\$\{email\}/g, email)
        .replace(
          /\$\{#dates.year\(date\)\}/g,
          new Date().getFullYear().toString(),
        );

      await sgMail.send({
        to: email,
        from: this.fromEmail || '',
        subject: 'Verify your email address',
        html: html,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Send email verification failed',
        );
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async sendEmailWelcomeStaff(
    fullName: string,
    email: string,
    password: string,
  ) {
    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'modules',
        'mail',
        'html',
        'EmailWelcomeStaff.html',
      );
      let html = await readFile(templatePath, 'utf-8');

      html = html
        .replace(/\$\{fullName\}/g, fullName)
        .replace(/\$\{email\}/g, email)
        .replace(/\$\{password\}/g, password)
        .replace(
          /\$\{#dates.year\(date\)\}/g,
          new Date().getFullYear().toString(),
        );

      await sgMail.send({
        to: email,
        from: this.fromEmail || '',
        subject: 'Welcome to Salon',
        html: html,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Send email welcome failed',
        );
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async sendEmailBookingSuccess(booking: Booking) {
    console.log('start send email', booking);
    const { staff, timeSlot, slotDate } = booking.staffSlot;
    const { fullName, email } = booking.customer;
    const { bookingServices, store, paymentType, status } = booking;
    try {
      console.log('Sending email booking to:', booking);
      const templatePath = path.join(
        process.cwd(),
        'src',
        'modules',
        'mail',
        'html',
        'EmailBookingSuccess.html',
      );
      let html = await readFile(templatePath, 'utf-8');

      // 1. Mapping text
      const bookingStatusText =
        status === BookingStatus.CONFIRMED_PAYMENT
          ? 'Confirmed'
          : status === BookingStatus.CANCELED
            ? 'Cancelled'
            : 'Pending';

      const paymentTypeText =
        paymentType === BookingPaymentTypeEnum.OFFLINE
          ? 'Cash'
          : paymentType === BookingPaymentTypeEnum.ONLINE
            ? 'Online payment (PayOS)'
            : 'Unknown';

      const timeSlotStr = `${timeSlot.startTime} - ${timeSlot.endTime}`;

      // 2. Services HTML
      const serviceListHtml = bookingServices
        .map(
          (bs) => `
          <p style="margin:0 0 8px;">
            • ${bs.service.name} — <strong>${bs.service.price.toLocaleString()}₫</strong>
          </p>
        `,
        )
        .join('');

      // 3. Replace variables
      html = html
        .replace(/\$\{fullName\}/g, fullName || 'Customer')
        .replace(/\$\{storeName\}/g, store?.name || 'Unknown Store')
        .replace(/\$\{staffName\}/g, staff?.user.fullName || 'Unknown Staff')
        .replace(
          /\$\{slotDate\}/g,
          new Date(slotDate).toISOString().split('T')[0],
        )
        .replace(/\$\{timeSlot\}/g, timeSlotStr)
        .replace(/\$\{serviceList\}/g, serviceListHtml)
        .replace(/\$\{paymentTypeText\}/g, paymentTypeText)
        .replace(/\$\{bookingStatusText\}/g, bookingStatusText);

      console.log('Final email HTML:', html);

      await sgMail.send({
        to: email,
        from: this.fromEmail || '',
        subject: 'Thank you for your booking',
        html: html,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Send email booking success failed',
        );
      } else {
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }
}
