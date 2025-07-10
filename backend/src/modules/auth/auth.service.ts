import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users';
import { Account, AccountsService } from '../accounts';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private accountsService: AccountsService,
        private jwtService: JwtService
    ) { }

    async login(dto: LoginDto) {
        const account = await this.accountsService.findByEmail(dto.email);

        if (!account) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, account.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: account.id,
            email: account.email,
            role: account.role,
        };
        const token = await this.jwtService.signAsync(payload);


        const publicUser = await this.usersService.findPublicByAccountId(account.id);

        return {
            access_token: token,
            user: publicUser,
        };
    }

    async register(dto: RegisterDto) {
        const existing = await this.accountsService.findByEmail(dto.email);
        if (existing) throw new ConflictException('Email already exists');
        const hashed = await bcrypt.hash(dto.password, 10);

        let account: Account;
        try {
            account = await this.accountsService.create({
                email: dto.email,
                password: hashed,
            });
        } catch (err) {

            throw new BadRequestException('Failed to create account');
        }

        try {
            const user = await this.usersService.create({
                name: dto.name,
                account,
            });

            const payload = {
                sub: account.id,
                email: account.email,
                role: account.role,
            };
            const token = await this.jwtService.signAsync(payload);

            return {
                access_token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: account.email,
                    role: account.role,
                },
            };


        } catch (err) {
            await this.accountsService.remove(account.id);
            throw new BadRequestException('Failed to create user profile');
        }
    }

    async getCurrentUser(accountId: number) {
        return this.usersService.findPublicByAccountId(accountId);
    }
}
