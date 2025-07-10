import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PublicUser, PublicUserCollection, UsersQueryFilter } from '../../common/types/users';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findPublicAll(params: UsersQueryFilter = {}): Promise<PublicUserCollection> {
        const { page = 1, limit = 10, search } = params;
        const count = this.userRepository.createQueryBuilder('user')
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.account', 'account')
            .addSelect(['account.role', 'account.email'])
            .orderBy('user.id', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);

        if (search) {
            query.where(
                'user.name ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const [rows, total] = await Promise.all([
            query.getRawMany(),
            query.getCount(),
        ]);

        return {
            users: rows?.map(row => this.castToPublicUser(row)) || [],
            total,
            page,
            pageSize: limit
        };
    }

    async findPublicById(@Param('id', ParseIntPipe) id: number): Promise<PublicUser | null> {
        const row = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.account', 'account')
            .addSelect(['account.role', 'account.email'])
            .where('user.id = :id', { id })
            .getRawOne()


        return row ? this.castToPublicUser(row) : null;
    }

    async findPublicByAccountId(accountId: number): Promise<PublicUser | null> {
        const row = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.account', 'account')
            .addSelect(['account.role', 'account.email'])
            .where('account.id = :accountId', { accountId })
            .getRawOne();

        return row ? this.castToPublicUser(row) : null;
    }


    async updateProfile(id: number, data: Partial<User>): Promise<PublicUser> {
        await this.userRepository.update(id, data);
        return this.findPublicById(id) as Promise<PublicUser>;
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async create(data: Partial<User>): Promise<User> {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    private castToPublicUser(row: any): PublicUser {
        return {
            id: row.user_id,
            name: row.user_name,
            email: row.account_email,
            role: row.account_role,
        };
    }
}
