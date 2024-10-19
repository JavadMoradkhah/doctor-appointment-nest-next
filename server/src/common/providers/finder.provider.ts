import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { FindOr404 } from '../interfaces/finders/find-or-404.interface';
import { FindOrFail } from '../interfaces/finders/find-or-fail.interface';
import { FindOrForbid } from '../interfaces/finders/find-or-forbid.interface';

@Injectable()
export abstract class FinderProvider
  implements FindOr404, FindOrFail, FindOrForbid
{
  abstract findOr404(id: number): Promise<ObjectLiteral>;
  abstract findOrFail(id: number): Promise<ObjectLiteral>;
  abstract findOrForbid(id: number): Promise<ObjectLiteral>;
}
