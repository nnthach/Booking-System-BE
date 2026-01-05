import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { UserRole } from 'src/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  // reflector đọc metadata
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY, // la metadata
      [context.getHandler(), context.getClass()], // get method & get controller
    );
    // require role trả ra [] | undefine
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{
      user?: Partial<User> & { role?: Role | UserRole };
    }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!user.role) {
      throw new UnauthorizedException('User does not have a role');
    }

    const roleName: UserRole =
      typeof user.role === 'object' ? user.role.name : user.role;
    return requiredRoles.includes(roleName);
  }
}
