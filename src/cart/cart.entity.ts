import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { JoinColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'int', default: 0 })
  total: number;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.cartItems)
  @JoinColumn({ name: 'userId' })
  user: User;
}
