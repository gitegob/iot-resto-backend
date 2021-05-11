import { Role } from './enum.interface';

export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
}

export interface RestoPayload {
  id: string;
  name: string;
  active: boolean;
  addedAt: Date;
}
