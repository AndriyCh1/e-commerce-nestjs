import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Cart } from './cart.entity';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductModule, UserModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
