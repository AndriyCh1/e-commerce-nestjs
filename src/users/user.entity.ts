import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { Role } from '../common/enums/role.enum';
import { Cart } from '../cart/cart.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: '50' })
  firstName: string;

  @Column({ type: 'varchar', length: '50' })
  secondName: string;

  @Column({ type: 'varchar', length: '100' })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: string;

  @OneToMany(() => Cart, (cart) => cart.user, { onDelete: 'CASCADE' })
  cartItems: Cart[];
}
