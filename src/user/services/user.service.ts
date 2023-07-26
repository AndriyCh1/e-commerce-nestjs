import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories';
import { CreateUserDto, UpdateProfileDto, UpdateUserDto } from '../dto';
import { User } from '../user.entity';
import { AuthService } from '../../auth/services/auth.service';
import { BaseEntityService } from '../../common/services/base-entity.service';
import { FindAllUsersDto } from '../dto/find-all-users.dto';

@Injectable()
export class UserService extends BaseEntityService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super(userRepository, 'User');
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);

    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with this email does not exist`);
    }

    return user;
  }

  async findAll(dto: FindAllUsersDto): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.' + dto.sortBy)
      .skip(dto.skip)
      .take(dto.pageSize);

    return await queryBuilder.getMany();
  }

  async updateProfile(id: User['id'], dto: UpdateProfileDto): Promise<User> {
    const { firstName, secondName, currentPassword, newPassword } = dto;
    let password;

    if (currentPassword && newPassword) {
      const user = await this.userRepository.findOne({ where: { id } });
      const isCurrentPasswordVerified = await this.authService.verifyPassword(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordVerified) {
        throw new BadRequestException('Wrong password provided');
      }

      password = await this.authService.hashPassword(newPassword);
    }

    return await this.update(id, { firstName, secondName, password });
  }

  async updateUser(id: User['id'], dto: UpdateUserDto): Promise<User> {
    const password = dto.password
      ? await this.authService.hashPassword(dto.password)
      : undefined;

    return await this.update(id, { ...dto, password });
  }
}
