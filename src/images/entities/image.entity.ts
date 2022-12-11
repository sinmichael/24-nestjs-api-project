import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  hits: number;

  @Column()
  uri: string;

  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
