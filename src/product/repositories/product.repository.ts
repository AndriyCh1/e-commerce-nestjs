import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository extends Repository<Product> {}
