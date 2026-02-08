/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IApiResponse } from '../interfaces';
import { Request } from 'express';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  IApiResponse<T>
> {
  private getDefaultMessage(method: string): string {
    switch (method) {
      case 'POST':
        return 'Created successfully';
      case 'PUT':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      case 'GET':
        return 'Get successfully';
      default:
        return 'Request successful';
    }
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        console.log('Data in response interceptor from controller:', data);
        // Kiểm tra dữ liệu đã theo định dạng ApiResponse chưa ({ success, message, data })
        if (data && typeof data === 'object' && 'success' in data) {
          return data as IApiResponse<T>;
        }

        let finalMessage = this.getDefaultMessage(request.method);

        // Nếu controller trả thêm message riêng (vd: { message: 'User created', id: 1 })
        // Lấy message đó làm finalMessage
        if (data && typeof data === 'object' && 'message' in data) {
          finalMessage = data.message;

          // tách message ra khỏi data
          const { message, ...rest } = data as Record<string, unknown>;

          const safeRest = rest as Record<string, unknown>;
          data = Object.keys(safeRest).length > 0 ? (safeRest as T) : undefined;
        }

        // Lấy giá trị bên trong data làm data chính:
        if (data && typeof data === 'object' && 'data' in data) {
          data = data.data as T;
        }

        return {
          success: true,
          message: finalMessage,
          data,
        };
      }),
    );
  }
}
