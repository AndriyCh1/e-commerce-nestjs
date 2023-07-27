import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Cart } from '../cart.entity';

@Injectable()
export class CartRepository extends Repository<Cart> {}
