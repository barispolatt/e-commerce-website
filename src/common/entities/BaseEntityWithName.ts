import { BaseEntity } from './BaseEntity';
import { Column } from 'typeorm';

export abstract class BaseEntityWithName extends BaseEntity {
  @Column({ type: 'varchar', length: 150, unique: false })
  name: string;

  constructor(base: Partial<BaseEntityWithName>) {
    super(base);
    Object.assign(this, { ...base });
  }
}
