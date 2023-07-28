import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { EmailConfirmationService } from '../../email/services/email-confirmation.service';
import { LoginDto, SignupDto } from '../dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const token = await this.authService.signup(dto);

    await this.emailConfirmationService.sendVerificationLink(dto.email);

    return token;
  }
}
