import { Test, TestingModule } from '@nestjs/testing';

import { EmailConfirmationService } from '../../email/services/email-confirmation.service';
import { LoginDto, SignupDto } from '../dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

const ACCESS_TOKEN = 'token';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let emailConfirmationService: EmailConfirmationService;

  const authServiceProviderValue = {
    login: jest.fn().mockResolvedValue({ access_token: ACCESS_TOKEN }),
    signup: jest.fn().mockResolvedValue({ access_token: ACCESS_TOKEN }),
  };

  const emailConfirmationServiceProviderValue = {
    sendVerificationLink: jest.fn().mockResolvedValue(''),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceProviderValue,
        },
        {
          provide: EmailConfirmationService,
          useValue: emailConfirmationServiceProviderValue,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    emailConfirmationService = module.get<EmailConfirmationService>(
      EmailConfirmationService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'johndoe@gmail.com',
      password: 'password',
    };

    it('should return access token', async () => {
      const result = await controller.login(loginDto);

      expect(result).toStrictEqual({ access_token: ACCESS_TOKEN });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'johndoe@gmail.com',
      password: 'password',
    };

    it('should return access token and call sendVerificationLink', async () => {
      const result = await controller.signup(signupDto);

      expect(result).toStrictEqual({ access_token: ACCESS_TOKEN });
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(
        emailConfirmationService.sendVerificationLink,
      ).toHaveBeenCalledWith(signupDto.email);
    });
  });
});
