import { BaseEntity } from '../../common/entities/BaseEntity';
import { Column } from 'typeorm';

export class Order extends BaseEntity {
  userID: number;
  @Column({ type: 'int' })
  totalPrice: number;

  constructor(dto: Partial<Order>) {
    super();
    Object.assign(this, { ...dto });
  }
}
