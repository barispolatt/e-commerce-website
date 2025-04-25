import { Module, Global } from '@nestjs/common';
import { AuthService } from './service/auth.service';

@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
