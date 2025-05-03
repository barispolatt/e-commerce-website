import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../../common/utils/types';

export class UpdateUserDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsEmail({}, { message: 'Email is required' })
  email?: string;
  @IsOptional()
  @IsStrongPassword({}, { message: 'Password is weak' })
  password?: string;
  @IsOptional()
  birthdate?: Date;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
