import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignupDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/services';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../common/enums';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async signup(dto: SignupDto): Promise<{ access_token: string }> {
    const { email, password, role } = dto;
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException(
        `User with such email: ${email} already exists `,
      );
    }

    const hash = await bcrypt.hash(password, 7);

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
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Incorrect credentials provided');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect credentials provided');
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

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expirationTime,
    });

    return token;
  }
}
