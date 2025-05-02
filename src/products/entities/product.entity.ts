import { BaseEntityWithName } from '../../common/entities/BaseEntityWithName';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product extends BaseEntityWithName {
  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {})
  images: ProductImage[];

  @ManyToOne(() => User, (user) => user.productsSold, { onDelete: 'SET NULL' })
  seller: User;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  constructor(productDTO: Partial<Product>) {
    super();
    Object.assign(this, { ...productDTO });
  }
}
