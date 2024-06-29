import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { PaginationData } from '../types/pagination-data.interface';
import { PaginationResponse } from '../types/pagination-response.interface';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginationResponse> {
    return next.handle().pipe(
      map((data: PaginationData): PaginationResponse => {
        const lastPage = Math.ceil(data.count / data.limit);
        const previousPage = data.page > 1 ? data.page - 1 : null;
        const nextPage = data.page < lastPage ? data.page + 1 : null;

        return {
          pagination: {
            itemsCount: data.count,
            currentPage: data.page,
            lastPage,
            previousPage,
            nextPage,
          },
          data: data.data,
        };
      }),
    );
  }
}
