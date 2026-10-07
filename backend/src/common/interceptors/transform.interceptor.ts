import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((result) => {
        // If the result already has data and message format
        if (result && typeof result === 'object' && ('data' in result || 'message' in result)) {
          return {
            success: true,
            statusCode,
            message: result.message || 'Operation successful',
            data: result.data !== undefined ? result.data : result,
          };
        }

        return {
          success: true,
          statusCode,
          message: 'Operation successful',
          data: result,
        };
      }),
    );
  }
}
