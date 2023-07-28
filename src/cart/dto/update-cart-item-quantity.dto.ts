import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
