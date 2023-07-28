import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, Roles } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Role } from '../../common/enums';
import { User } from '../../user/user.entity';
import { Cart } from '../cart.entity';
import { CreateCartItemDto, UpdateCartItemQuantityDto } from '../dto';
import { CartService } from '../services/cart.service';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async getCart(@CurrentUser('id') userId: User['id']) {
    return await this.cartService.findAll(userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async emptyCart(@CurrentUser('id') userId: User['id']) {
    await this.cartService.deleteAll(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async addItemToCart(
    @CurrentUser('id') userId: User['id'],
    @Body() dto: CreateCartItemDto,
  ) {
    return await this.cartService.create(userId, dto);
  }

  @Get('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async getCartItem(@Param('id') id: Cart['id']) {
    return await this.cartService.findById(id);
  }

  @Patch('/items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateCartItem(
    @Param('id') id: Cart['id'],
    @Body() dto: UpdateCartItemQuantityDto,
  ) {
    return await this.cartService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async removeItemFromCart(@Param('id') id: Cart['id']) {
    await this.cartService.delete(id);
  }
}
