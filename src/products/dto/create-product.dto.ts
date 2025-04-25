import {
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductImage {
  @IsString()
  url: string;

  @IsNumber()
  index: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @IsPositive()
  store_id: number;

  @IsInt()
  @IsPositive()
  category_id: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  images?: ProductImage[];
}
