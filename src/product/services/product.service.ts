import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '../repositories';
import { CreateProductDto, FindAllProductsDto, UpdateProductDto } from '../dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async findOne(id: Product['id']): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findAll(dto: FindAllProductsDto): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    const sortBy = 'product.' + dto.sortBy;

    queryBuilder.orderBy(sortBy, dto.order).skip(dto.skip).take(dto.pageSize);

    if (dto.name) {
      queryBuilder.where('product.name like :name', {
        name: '%' + dto.name + '%',
      });
    }

    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  async update(id: Product['id'], dto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, dto);

    return await this.productRepository.findOne({ where: { id } });
  }

  async delete(id: Product['id']): Promise<void> {
    await this.productRepository.delete({ id });
  }
}
