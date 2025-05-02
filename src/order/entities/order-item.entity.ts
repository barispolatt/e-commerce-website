import { BaseEntity } from '../../common/entities/BaseEntity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
    eager: true,
  })
  order: Order;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  constructor(dto: Partial<OrderItem>) {
    super();
    Object.assign(this, { ...dto });
  }
}
