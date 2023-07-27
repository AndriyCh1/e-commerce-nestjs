import { Column, Entity, Index, OneToMany } from 'typeorm';

import { Cart } from '../cart/cart.entity';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { Role } from '../common/enums';

@Entity()
export class User extends AbstractEntity {
  @Index()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  secondName: string;

  @Column({ type: 'varchar', length: '100' })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: string;

  @OneToMany(() => Cart, (cart) => cart.user, { onDelete: 'CASCADE' })
  cartItems: Cart[];
}
