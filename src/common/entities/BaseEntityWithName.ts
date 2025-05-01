import { BaseEntity } from './BaseEntity';
import { Column } from 'typeorm';

export abstract class BaseEntityWithName extends BaseEntity {
  @Column({ type: 'varchar', length: 150, unique: false })
  name: string;
}
