import { IAuthenticatedUser, IJwtPayload } from '@lumina/shared-interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        const jwtSecret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: IJwtPayload): Promise<IAuthenticatedUser> {
        if (payload.type !== 'access') {
            throw new UnauthorizedException('Invalid token type');
        }

        return {
            id: payload.sub,
            email: payload.email,
            fullName: payload.fullName,
            role: payload.role,
        };
    }
}
