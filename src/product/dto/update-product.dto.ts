import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(1, 1000)
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  price?: number;
}
