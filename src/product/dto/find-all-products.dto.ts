import { PageOptionsDto } from '../../common/dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortBy } from '../enums';

export class FindAllProductsDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy = SortBy.NAME;
}
