import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { UpdateProfileDto, UpdateUserDto } from '../dto';
import { UserService } from '../services';
import { Role } from '../../common/enums';
import { CurrentUser, Roles } from '../../auth/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async getProfile(@CurrentUser('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  // TODO: implement pagination
  async findAll() {
    return await this.userService.findAll();
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async updateProfile(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(id, dto);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(userId, dto);
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async deleteProfile(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    await this.userService.delete(id);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async delete(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    await this.userService.delete(userId);
  }
}
