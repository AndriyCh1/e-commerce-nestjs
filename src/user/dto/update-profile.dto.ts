import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  secondName?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  currentPassword?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  newPassword?: string;
}
