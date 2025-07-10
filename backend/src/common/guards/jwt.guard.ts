// auth/guards/jwt-auth.guard.ts

import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../../modules/accounts';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private dataSource: DataSource
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = (await super.canActivate(context)) as boolean;
        if (!isAuthenticated) return false;

        const request = context.switchToHttp().getRequest();
        const userFromToken = request.user;

        // Direct DB query, no service dependency
        const accountRepo = this.dataSource.getRepository(Account);
        const linkedAccount = await accountRepo.findOne({ where: { id: userFromToken.id } });
        if (!linkedAccount) {
            throw new UnauthorizedException('User not found');
        }
        if (userFromToken.role !== linkedAccount.role) {
            throw new UnauthorizedException('Role mismatch. Please re-login.');
        }
        return true;
    }
}
