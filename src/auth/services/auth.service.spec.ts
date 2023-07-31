import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { PostgresErrorCode, Role } from '../../common/enums';
import { UserService } from '../../user/services';
import { LoginDto, SignupDto } from '../dto';
import { AuthService } from './auth.service';

const JWT_SECRET = 'secret';
const JWT_EXPIRATION = '2h';
const ACCESS_TOKEN = 'token';
const HASHED_PASSWORD = 'hashedpassword';

const MOCK_USER = {
  id: '1',
  email: 'johndoe@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
};

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let userService: UserService;

  jest
    .spyOn(bcrypt, 'hash')
    .mockImplementation(() => Promise.resolve(HASHED_PASSWORD));

  jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

  // TODO: find out why this solution doesn't work
  // jest.mock('bcrypt', () => ({
  //   hash: jest.fn().mockResolvedValue(HASHED_PASSWORD),
  //   compare: jest.fn().mockResolvedValue(true),
  // }));

  const configServiceProviderValue = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'JWT_SECRET':
          return JWT_SECRET;
        case 'JWT_EXPIRATION':
          return JWT_EXPIRATION;
      }

      return undefined;
    }),
  };

  const jwtServiceProviderValue = {
    signAsync: jest.fn().mockResolvedValue(ACCESS_TOKEN),
  };

  const userServiceProviderValue = {
    create: jest.fn().mockResolvedValue(MOCK_USER),
    findOneByEmail: jest.fn().mockResolvedValue(MOCK_USER),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: configServiceProviderValue,
        },
        { provide: JwtService, useValue: jwtServiceProviderValue },
        { provide: UserService, useValue: userServiceProviderValue },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'johndoe@gmail.com',
      password: 'password',
      role: Role.User,
    };

    it('should create a new user and return an access token', async () => {
      const createUserSpy = jest.spyOn(userService, 'create');

      const result = await service.signup(signupDto);

      expect(createUserSpy).toBeCalledWith({
        ...signupDto,
        password: HASHED_PASSWORD,
      });
      expect(result).toStrictEqual({ access_token: ACCESS_TOKEN });
    });

    it('should throw BadRequestException when trying to sign up with an existing email', async () => {
      jest
        .spyOn(userService, 'create')
        .mockImplementationOnce(() =>
          Promise.reject({ code: PostgresErrorCode.UniqueViolation }),
        );

      expect.assertions(2);

      try {
        await service.signup(signupDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error).toHaveProperty(
          'message',
          `User with that ${signupDto.email} already exists`,
        );
      }
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'johndoe@gmail.com',
      password: 'password',
    };

    it('should return an access token when valid credentials are provided', async () => {
      const findOneUserByEmailSpy = jest.spyOn(userService, 'findOneByEmail');

      const result = await service.login(loginDto);

      expect(findOneUserByEmailSpy).toBeCalledWith(loginDto.email);
      expect(result).toEqual({ access_token: ACCESS_TOKEN });
    });

    it('should throw BadRequestException when invalid credentials are provided', async () => {
      const findOneUserByEmailSpy = jest.spyOn(userService, 'findOneByEmail');

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      expect.assertions(3);

      try {
        await service.login(loginDto);
      } catch (error) {
        expect(findOneUserByEmailSpy).toBeCalledWith(loginDto.email);
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error).toHaveProperty('message', `Wrong credentials provided`);
      }
    });
  });
});
