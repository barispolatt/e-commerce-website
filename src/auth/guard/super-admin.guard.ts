import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { dummyUsers } from '../../common/utils/data';
import { UserRole } from '../../common/utils/types';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = dummyUsers[0];
    return user.role === UserRole.SUPER_ADMIN;
  }
}
