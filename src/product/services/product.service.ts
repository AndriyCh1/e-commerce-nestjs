import { Injectable } from '@nestjs/common';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '../repositories';
import { CreateProductDto, FindAllProductsDto } from '../dto';
import { BaseEntityService } from '../../common/services/base-entity.service';

@Injectable()
export class ProductService extends BaseEntityService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
  ) {
    super(productRepository, 'Product');
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async findAll(dto: FindAllProductsDto): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder
      .orderBy('product.' + dto.sortBy, dto.order)
      .skip(dto.skip)
      .take(dto.pageSize);

    if (dto.name) {
      queryBuilder.where('product.name like :name', {
        name: '%' + dto.name + '%',
      });
    }

    return await queryBuilder.getMany();
  }
}
