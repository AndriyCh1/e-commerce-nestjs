import { Column, Entity, OneToMany } from 'typeorm';

import { Cart } from '../cart/cart.entity';
import { AbstractEntity } from '../common/entities/abstract.entity';

@Entity()
export class Product extends AbstractEntity {
  @Column({ type: 'varchar', length: '100' })
  name: string;

  @Column({ type: 'varchar', length: '1000', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'float', default: 0 })
  price: number;

  @OneToMany(() => Cart, (cart) => cart.product, { onDelete: 'CASCADE' })
  cartItems: Cart[];
}
