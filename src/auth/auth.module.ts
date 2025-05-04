import { Module, Global } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SuperAdminGuard } from './guard/super-admin.guard';
import { AdminGuard } from './guard/admin.guard';
import { AuthController } from './controller/auth.controller';

@Global()
@Module({
  providers: [AuthService, SuperAdminGuard, AdminGuard],
  exports: [AuthService, SuperAdminGuard, AdminGuard],
  controllers: [AuthController],
})
export class AuthModule {}
