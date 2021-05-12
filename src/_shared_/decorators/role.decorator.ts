import { SetMetadata } from '@nestjs/common';
import { Role } from '../interfaces/enums.interface';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
