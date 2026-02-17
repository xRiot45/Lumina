import { ROLES_KEY } from '@lumina/shared-common';
import { IAuthenticatedUser, UserRole } from '@lumina/shared-interfaces';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private refrector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.refrector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as IAuthenticatedUser;

        if (!user || !user?.role) {
            throw new ForbiddenException('User Role Not Found');
        }

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException(`Access denied. You need one of these roles: [${requiredRoles.join(', ')}]`);
        }

        return true;
    }
}
