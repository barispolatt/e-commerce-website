import { UserRole } from '../../common/utils/types';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityWithName } from '../../common/entities/BaseEntityWithName';
import { Order } from '../../order/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Comment } from './comment.entity';

@Entity('users')
export class User extends BaseEntityWithName {
  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'timestamp', nullable: true })
  birthdate: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Product, (product) => product.seller, {
    onDelete: 'CASCADE',
  })
  productsSold: Product[];

  /*@OneToMany(() => Comment, (comment) => comment.user, {
    onDelete: 'CASCADE',
  })
  userComments: Comment[];*/

  constructor(base: Partial<User>) {
    super();
    Object.assign(this, { ...base });
  }
}
