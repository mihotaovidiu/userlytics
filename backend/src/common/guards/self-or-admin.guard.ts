import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('No user found in request');
        }

        const paramId = parseInt(request.params.id, 10);
        if (user.role === 'admin' || user.id === paramId) {
            return true;
        }

        throw new ForbiddenException('You are not authorized to access this resource');
    }
}
