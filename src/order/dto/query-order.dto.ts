import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { OrderStatus, SortOrder } from '../../common/utils/types';

export class QueryOrderDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? parseInt(value, 10) : 1,
  )
  page?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? parseInt(value, 10) : 10,
  )
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams): SortOrder => {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return lowerValue === 'asc' || lowerValue === 'desc'
        ? lowerValue
        : 'desc';
    }
    return 'desc';
  })
  order?: SortOrder;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? parseInt(value, 10) : undefined,
  )
  userId?: number;
}
