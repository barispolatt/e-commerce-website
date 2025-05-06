import { Module, Global } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SuperAdminGuard } from './guard/super-admin.guard';
import { AdminGuard } from './guard/admin.guard';
import { AuthController } from './controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt/JwtStrategy';

@Global()
@Module({
  imports: [
    UsersModule,
    ConfigService,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, SuperAdminGuard, AdminGuard, JwtStrategy],
  exports: [AuthService, SuperAdminGuard, AdminGuard],
  controllers: [AuthController],
})
export class AuthModule {}
