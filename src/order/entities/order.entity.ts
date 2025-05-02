import { BaseEntity } from '../../common/entities/BaseEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'int' })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  constructor(dto: Partial<Order>) {
    super();
    Object.assign(this, { ...dto });
  }
}
