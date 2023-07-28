import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { EmailConfirmationController } from './controllers/email-confirmation.controller';
import { EmailService } from './services/email.service';
import { EmailConfirmationService } from './services/email-confirmation.service';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailModule {}
