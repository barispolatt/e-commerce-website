import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../../common/utils/types';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../service/auth.service';

interface RequestUser {
  role?: UserRole;
}
interface RequestWithUser extends RequestUser {
  user?: RequestUser;
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Unknown user');
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    throw new UnauthorizedException('Unauthorized user, needs SuperAdmin');
  }
}
