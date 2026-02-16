import { IAuthenticatedUser } from '@lumina/shared-interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: keyof IAuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IAuthenticatedUser;

    if (data && user) {
        return user[data];
    }

    return user;
});
