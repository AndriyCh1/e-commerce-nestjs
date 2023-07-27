import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Env } from '../../common/enums';
import { User } from '../../user/user.entity';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(Env.JWT_SECRET),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Pick<User, 'id' | 'email' | 'role'>> {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
