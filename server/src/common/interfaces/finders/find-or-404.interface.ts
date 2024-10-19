import { ObjectLiteral } from 'typeorm';

export interface FindOr404 {
  findOr404(id: number): Promise<ObjectLiteral>;
}
