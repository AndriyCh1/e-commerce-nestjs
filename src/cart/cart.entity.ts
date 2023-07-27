import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { JoinColumn } from 'typeorm';

import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity()
@Unique(['product', 'user'])
export class Cart {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.cartItems, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.cartItems, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
