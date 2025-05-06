import { UserRole } from '../../common/utils/types';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
