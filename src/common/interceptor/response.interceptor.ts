import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        timestamp: new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
      })),
    );
  }
}
