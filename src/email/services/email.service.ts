import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail, { Options } from 'nodemailer/lib/mailer';

import { Env } from '../../common/enums';

@Injectable()
export class EmailService {
  private nodemailer: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailer = createTransport({
      service: configService.get(Env.EMAIL_SERVICE),
      auth: {
        user: configService.get(Env.EMAIL_USER),
        pass: configService.get(Env.EMAIL_PASSWORD),
      },
    });
  }

  async sendMail(options: Options) {
    return this.nodemailer.sendMail(options);
  }
}
