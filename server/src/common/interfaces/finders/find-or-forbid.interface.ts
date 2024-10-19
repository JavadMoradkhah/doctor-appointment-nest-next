import { ObjectLiteral } from 'typeorm';

export interface FindOrForbid {
  findOrForbid(id: number): Promise<ObjectLiteral>;
}
