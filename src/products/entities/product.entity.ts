import { BaseEntityWithName } from '../../common/entities/BaseEntityWithName';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../order/entities/order-item.entity';

@Entity('products')
export class Product extends BaseEntityWithName {
  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {})
  images: ProductImage[];

  @ManyToOne(() => User, (user) => user.productsSold, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  is_deleted: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
    onDelete: 'CASCADE',
  })
  orderItems: OrderItem[];

  constructor(productDTO: Partial<Product>) {
    super();
    Object.assign(this, { ...productDTO });
  }
}
