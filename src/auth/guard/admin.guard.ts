import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Reflector } from '@nestjs/core';
import { dummyUsers } from '../../common/utils/data';
import { UserRole } from '../../common/utils/types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = dummyUsers[0];
    return user.role === UserRole.ADMIN;
  }
}
