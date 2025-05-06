import { Injectable } from '@nestjs/common';
import { UserRole } from '../../common/utils/types';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && password === user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
