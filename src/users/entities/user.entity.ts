import { UserRole } from '../../common/utils/types';
import { Column, Entity } from 'typeorm';
import { BaseEntityWithName } from '../../common/entities/BaseEntityWithName';

@Entity('users')
export class User extends BaseEntityWithName {
  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isActive: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'timestamp', nullable: true })
  birthdate: Date;

  constructor(base: Partial<User>) {
    super();
    Object.assign(this, { ...base });
  }
}
