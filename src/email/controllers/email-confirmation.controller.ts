import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ConfirmEmailDto } from '../dto';
import { EmailConfirmationService } from '../services/email-confirmation.service';

@ApiTags('email')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('confirm')
  async confirm(@Query() dto: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeToken(dto.token);

    await this.emailConfirmationService.confirmEmail(email);
  }
}
