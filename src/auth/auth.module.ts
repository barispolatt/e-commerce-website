import { Module, Global } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SuperAdminGuard } from './guard/super-admin.guard';
import { AdminGuard } from './guard/admin.guard';

@Global()
@Module({
  providers: [AuthService, SuperAdminGuard, AdminGuard],
  exports: [AuthService, SuperAdminGuard, AdminGuard],
})
export class AuthModule {}
