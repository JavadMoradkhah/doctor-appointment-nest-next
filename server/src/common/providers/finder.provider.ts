import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export abstract class FinderProvider {
  abstract findOr404(id: number): Promise<ObjectLiteral>;
  abstract findOrFail(id: number): Promise<ObjectLiteral>;
  abstract findOrForbid(id: number): Promise<ObjectLiteral>;
}
