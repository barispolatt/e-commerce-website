import { BaseEntity } from '../../common/entities/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'int' })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  constructor(dto: Partial<Order>) {
    super();
    Object.assign(this, { ...dto });
  }
}
