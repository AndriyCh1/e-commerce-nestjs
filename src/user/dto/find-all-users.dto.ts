import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../common/dto';
import { SortBy } from '../enums';

export class FindAllUsersDto extends PageOptionsDto {
  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy = SortBy.CREATED_AT;
}
