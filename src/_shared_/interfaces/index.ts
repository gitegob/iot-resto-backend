import { Role } from './enum.interface';

export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
}
