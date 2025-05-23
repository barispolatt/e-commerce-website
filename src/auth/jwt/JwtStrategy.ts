import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(Number(payload.sub));
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
