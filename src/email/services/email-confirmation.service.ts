import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { compile } from 'handlebars';
import * as path from 'path';

import { Env } from '../../common/enums';
import { UserService } from '../../user/services';
import { JwtVerificationPayload } from '../interfaces';
import { EmailService } from './email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  private buildUrl(token: string): string {
    return `${this.configService.get(
      Env.EMAIL_CONFIRMATION_URL,
    )}?token=${token}`;
  }

  private async buildMessage(url: string): Promise<string> {
    const html = await fs.promises.readFile(
      path.join(__dirname, '../..', 'common/templates/email-confirmation.html'),
      'utf-8',
    );

    const template = compile(html);

    return template({ url });
  }

  public async sendVerificationLink(email: string): Promise<string> {
    const payload: JwtVerificationPayload = { email };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get(Env.JWT_VERIFICATION_SECRET),
      expiresIn: this.configService.get(Env.JWT_VERIFICATION_EXPIRATION_TIME),
    });

    const url = this.buildUrl(token);

    const html = await this.buildMessage(url);

    const subject = 'Email confirmation';

    return this.emailService.sendMail({ to: email, subject, html });
  }

  public async confirmEmail(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);

    if (user.isEmailConfirmed) {
      throw new NotFoundException('Email is already confirmed');
    }

    await this.userService.markEmailAsConfirmed(email);
  }

  public async decodeToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get(Env.JWT_VERIFICATION_SECRET),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }
}
