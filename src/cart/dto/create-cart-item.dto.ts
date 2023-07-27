import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity = 1;
}
