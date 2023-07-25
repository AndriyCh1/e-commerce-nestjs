import { AbstractEntity } from '../common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Product extends AbstractEntity {
  @Column({ type: 'varchar', length: '100' })
  name: string;

  @Column({ type: 'varchar', length: '1000' })
  description: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  price: number;
}
