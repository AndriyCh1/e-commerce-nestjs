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
import { CreateCartItemDto, UpdateCartItemDto } from '../dto';
import { CartService } from '../services/cart.service';

@ApiTags('cart')
@Controller('cart/items')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async create(
    @CurrentUser('id') userId: User['id'],
    @Body() dto: CreateCartItemDto,
  ) {
    return await this.cartService.create(userId, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async findOne(@Param('id') id: Cart['id']) {
    return await this.cartService.findById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async findAll(@CurrentUser('id') userId: User['id']) {
    return await this.cartService.findAll(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async update(@Param('id') id: Cart['id'], @Body() dto: UpdateCartItemDto) {
    return await this.cartService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async delete(@Param('id') id: Cart['id']) {
    await this.cartService.delete(id);
  }
}
