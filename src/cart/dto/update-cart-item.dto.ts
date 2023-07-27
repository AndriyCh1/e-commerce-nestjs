import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
