import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Post('/webhook')
  paymentWebhook(@Body() webhookData: any) {
    return this.transactionService.handleWebhookPayOS(webhookData);
  }

  @Get('check-payment')
  checkPayment(@Query('orderCode') orderCode: number) {
    return this.transactionService.checkPayment(+orderCode);
  }

  @Get('by-order/:orderCode')
  findOneByOrderCode(@Param('orderCode') orderCode: string) {
    return this.transactionService.findOneByOrderCode(+orderCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
