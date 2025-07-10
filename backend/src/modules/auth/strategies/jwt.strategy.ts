import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountsService } from '../../accounts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly accountsService: AccountsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const { sub: id } = payload;

        const account = await this.accountsService.findById(id);
        if (!account) {
            throw new UnauthorizedException('Invalid token: account not found');
        }

        return {
            id: account.id,
            email: account.email,
            role: account.role,
        };
    }
}
