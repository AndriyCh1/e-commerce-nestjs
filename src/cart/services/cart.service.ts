import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateCartItemDto } from '../../../dist/cart/dto/update-cart-item.dto';
import { BaseEntityService } from '../../common/services/base-entity.service';
import { Product } from '../../product/product.entity';
import { ProductService } from '../../product/services';
import { UserService } from '../../user/services';
import { User } from '../../user/user.entity';
import { Cart } from '../cart.entity';
import { CreateCartItemDto } from '../dto';
import { CartRepository } from '../repositories';

@Injectable()
export class CartService extends BaseEntityService<Cart> {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: CartRepository,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {
    super(cartRepository, 'Cart');
  }

  private async findUserCartItemByProduct(
    userId: User['id'],
    productId: Product['id'],
  ): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
  }

  public async create(
    userId: User['id'],
    dto: CreateCartItemDto,
  ): Promise<Cart> {
    const { productId, quantity } = dto;
    const product = await this.productService.findById(productId);
    const user = await this.userService.findById(userId);

    const cartItem = await this.findUserCartItemByProduct(userId, productId);

    if (cartItem) {
      return await this.update(cartItem.id, { quantity });
    }

    const newCartItem = this.cartRepository.create({
      user,
      product,
      quantity,
    });

    return await this.cartRepository.save(newCartItem, {});
  }

  public async findById(id: Cart['id']): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return cartItem;
  }

  public async findAll(userId: User['id']): Promise<Cart[]> {
    return await this.cartRepository.find({ where: { user: { id: userId } } });
  }

  public async update(id: Cart['id'], dto: UpdateCartItemDto): Promise<Cart> {
    const cartItem = await this.findById(id);

    if (dto.quantity > cartItem.product.quantity) {
      throw new BadRequestException('Not enough products');
    }

    await this.cartRepository.update(id, dto);

    return await this.findById(id);
  }
  public async deleteAll(userId: User['id']): Promise<void> {
    await this.cartRepository
      .createQueryBuilder('cart')
      .innerJoin('cart.user', 'user')
      .delete()
      .where('user.id = :userId', { userId })
      .execute();
  }
}
