import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './common/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService: ConfigService = app.get(ConfigService);

  const port = configService.get<number>(Env.PORT) ?? 3000;
  await app.listen(port);
}

bootstrap();
