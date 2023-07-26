import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { UpdateProfileDto, UpdateUserDto } from '../dto';
import { UserService } from '../services';
import { Role } from '../../common/enums';
import { CurrentUser, Roles } from '../../auth/decorators';
import { FindAllUsersDto } from '../dto/find-all-users.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async getProfile(@CurrentUser('id') id: number) {
    return await this.userService.findById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Query() dto: FindAllUsersDto) {
    return await this.userService.findAll(dto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(id, dto);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('userId') userId: number, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(userId, dto);
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async deleteProfile(@CurrentUser('id') id: number) {
    await this.userService.delete(id);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async delete(@Param('userId') userId: number) {
    await this.userService.delete(userId);
  }
}
