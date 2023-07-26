import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Order } from '../enums';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;

  @IsEnum(Order)
  @IsOptional()
  order: Order = Order.ASC;

  get skip(): number {
    return (this.pageIndex - 1) * this.pageSize;
  }
}
