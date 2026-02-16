import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    override handleRequest<TUser>(err: unknown, user: TUser | false, info: unknown): TUser {
        if (err || !user) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Unauthorized access',
                error: 'Unauthorized',
            });
        }

        return user;
    }
}
