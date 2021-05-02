import { SetMetadata } from '@nestjs/common';
import { Role } from '../../_shared_/interfaces/enum.interface';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
