import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/BaseEntity';
import { User } from './user.entity';
@Entity()
export class Comment extends BaseEntity {
  @Column()
  text: string;

  @ManyToOne(() => User, (comment) => comment.userComments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  comment: Comment;

  constructor(base: Partial<Comment>) {
    super();
    Object.assign(this, { ...base });
  }
}
