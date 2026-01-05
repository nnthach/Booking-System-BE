import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enums/role.enum';


// metadata(key, value)
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
