/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IApiResponse } from '../interfaces';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let error: any;

    if (exception instanceof HttpException) {
      // Khi lỗi có chủ đich (biết trước - lỗi http)
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const exceptionResponseObj = exceptionResponse as Record<string, any>;
        message =
          exceptionResponseObj.message ||
          exceptionResponseObj.error ||
          'Unknown error';

        //Lỗi validate DTO
        if (Array.isArray(exceptionResponseObj.message)) {
          message = 'Input data validation failed';
          error = exceptionResponseObj.message;
        }
      } else {
        message = 'Unknown error';
      }

      if (status === Number(HttpStatus.UNAUTHORIZED)) {
        if (message === 'Unauthorized') {
          message = 'User is not authenticated or invalid token';
        }
      }
      if (status === Number(HttpStatus.FORBIDDEN)) {
        message = 'User does not have permission to access this resource';
      }
    } else {
      // Lỗi không mong muốn (không biết trước - lỗi hệ thống)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'System encountered an unexpected error';
      this.logger.error(exception);
    }

    const errorResponse: IApiResponse<any> = {
      success: false,
      message,
      ...(error && { error }),
    };

    response.status(status).json(errorResponse);
  }
}
