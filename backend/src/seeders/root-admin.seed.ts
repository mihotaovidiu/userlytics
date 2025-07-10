// seed.ts
import * as bcrypt from 'bcrypt';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AccountsService } from '../modules/accounts';
import { UsersService } from '../modules/users';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const accountsService = app.get(AccountsService);
    const usersService = app.get(UsersService);

    const existing = await accountsService.findByEmail('admin@deskbird.io');
    if (existing) {
        console.log('Admin already exists. Skipping seeding.');
        await app.close();
        return;
    }

    const password = await bcrypt.hash('admin123', 10);

    const account = await accountsService.create({
        email: 'admin@deskbird.io',
        password,
        role: 'admin',
    });

    await usersService.create({
        name: 'Admin User',
        account,
    });

    console.log('Admin seeded.');
    await app.close();
}

bootstrap();
