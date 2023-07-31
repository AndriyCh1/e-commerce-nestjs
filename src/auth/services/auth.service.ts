import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Env, PostgresErrorCode } from '../../common/enums';
import { hashPassword, verifyPassword } from '../../common/utils';
import { UserService } from '../../user/services';
import { LoginDto, SignupDto } from '../dto';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signup(dto: SignupDto): Promise<{ access_token: string }> {
    const { email, password, role } = dto;

    const hash = await hashPassword(password);

    try {
      const createdUser = await this.userService.create({
        email,
        password: hash,
        role,
      });

      const token = await this.signToken({
        sub: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      });

      return { access_token: token };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(`User with that ${email} already exists`);
      }
    }
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.userService.findOneByEmail(email);

    const isPasswordMatching = await verifyPassword(password, user.password);

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const token = await this.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: token };
  }

  async signToken(payload: JwtPayload): Promise<string> {
    const secret = this.configService.get<string>(Env.JWT_SECRET);
    const expirationTime = this.configService.get<string>(
      Env.JWT_EXPIRATION_TIME,
    );

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expirationTime,
    });
  }
}
