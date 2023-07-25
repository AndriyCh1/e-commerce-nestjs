import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories';
import { CreateUserDto } from '../dto';
import { User } from '../user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);

    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: User['email']): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
