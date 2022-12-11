import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../user.roles.enum';
import { Image } from 'src/images/entities/image.entity';

@Entity()
@Unique(['emailAddress'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emailAddress: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  role: UserRoles;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @Column({ nullable: true, default: null })
  passwordResetToken: string;

  /**
   * Validate password by comparing the password to the hashed password
   *
   * @param password - Password
   * @returns boolean
   *
   */
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
