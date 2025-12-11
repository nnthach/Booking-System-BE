import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { readFile } from 'fs/promises';
import * as path from 'path';

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
}
