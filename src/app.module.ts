import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { Env } from './common/enums';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>(Env.DB_HOST),
        port: configService.get<number>(Env.DB_PORT),
        database: configService.get<string>(Env.DB_NAME),
        username: configService.get<string>(Env.DB_USER),
        password: configService.get<string>(Env.DB_PASSWORD),
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/migrations/*.js'],
        logging: false,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    CartModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
