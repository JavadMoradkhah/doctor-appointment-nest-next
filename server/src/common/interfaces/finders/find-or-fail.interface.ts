import { ObjectLiteral } from 'typeorm';

export interface FindOrFail {
  findOrFail(id: number): Promise<ObjectLiteral>;
}
