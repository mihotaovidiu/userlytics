import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "./entities/account.entity";

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRespository: Repository<Account>,
    ) { }

    async findById(id: number): Promise<Account | null> {
        return this.accountRespository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<Account | null> {
        return this.accountRespository.findOne({ where: { email } });
    }

    async create(data: Partial<Account>): Promise<Account> {
        const account = this.accountRespository.create(data);
        return this.accountRespository.save(account);
    }

    async updateRole(id: number, role: 'admin' | 'user'): Promise<void> {
        const account = await this.findById(id);
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} not found`);
        }

        account.role = role;
        await this.accountRespository.save(account);
    }

    async remove(id: number): Promise<void> {
        const account = await this.findById(id);
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} not found`);
        }

        await this.accountRespository.remove(account);
    }
}
