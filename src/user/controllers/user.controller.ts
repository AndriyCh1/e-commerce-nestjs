import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser, Roles } from '../../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Role } from '../../common/enums';
import { FindAllUsersDto, UpdateProfileDto, UpdateUserDto } from '../dto';
import { UserService } from '../services';

@ApiTags('users')
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async deleteProfile(@CurrentUser('id') id: number) {
    await this.userService.delete(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}
