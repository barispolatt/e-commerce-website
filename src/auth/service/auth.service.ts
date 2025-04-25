import { Injectable } from '@nestjs/common';
import { UserRole } from '../../common/utils/types';

@Injectable()
export class AuthService {
  validateUserRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return userRole <= requiredRole;
  }
}
