import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../../common/utils/types';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is required' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password is weak' })
  password: string;
  @IsOptional()
  birthdate: Date;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
