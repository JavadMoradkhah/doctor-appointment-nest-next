import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/modules/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/modules/pagination/interfaces/paginated.interface';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class PaginationService {
  paginate<Entity extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    entities: Entity[],
    itemsCount: number,
  ) {
    const currentPage = paginationQuery.page;
    const itemsPerPage = paginationQuery.limit;
    const totalPages = Math.ceil(itemsCount / itemsPerPage);

    const previousPage =
      totalPages > 1 && currentPage > 1 ? currentPage - 1 : null;

    const nextPage =
      totalPages > 1 && currentPage < totalPages ? currentPage + 1 : null;

    const response: Paginated<Entity> = {
      meta: {
        totalItems: itemsCount,
        itemsPerPage: itemsPerPage,
        totalPages: totalPages,
        currentPage: currentPage,
        nextPage: nextPage,
        previousPage: previousPage,
      },
      data: entities,
    };

    return response;
  }
}
