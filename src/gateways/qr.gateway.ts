import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS } from '@payos/node';

export interface PayOsPaymentLinkResponse {
  checkoutUrl: string;
  orderCode: number;
  amount: number;
  description: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}

@Injectable()
export class PayOsGateway {
  private readonly payos: PayOS;

  constructor(private readonly configService: ConfigService) {
    this.payos = new PayOS({
      clientId: this.configService.getOrThrow<string>('PAYOS_CLIENT_ID'),
      apiKey: this.configService.getOrThrow<string>('PAYOS_API_KEY'),
      checksumKey: this.configService.getOrThrow<string>('PAYOS_CHECKSUM_KEY'),
    });
  }

  async createPaymentLink(payload: {
    orderCode: number;
    amount: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    expiredAt;
  }): Promise<PayOsPaymentLinkResponse> {
    try {
      const response = await this.payos.paymentRequests.create(payload);

      return response as PayOsPaymentLinkResponse;
    } catch {
      throw new InternalServerErrorException(
        'Create PayOS payment link failed',
      );
    }
  }

  async verifyPaymentWebhook(webhookData: any) {
    try {
      const verified = await this.payos.webhooks.verify(webhookData);
      return verified;
    } catch (error) {
      console.log('verify webhook err', error);
      return null;
    }
  }
}
